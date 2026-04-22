import { Router, RequestHandler } from "express";
import { createMessageSchema } from "../../shared/api";
import { prisma } from "../index";

const router = Router();

const authRequired: RequestHandler = (req, res, next) => {
  const userId = (req as any).userId;
  if (!userId) {
    return res.status(401).json({
      error: "Unauthorized - authentication required",
      statusCode: 401,
    });
  }
  next();
};

export const handleGetConversations: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const where = {
      isActive: true,
      OR: [
        { participantOneId: userId },
        { participantTwoId: userId },
      ]
    };

    const total = await prisma.conversation.count({ where });
    const skip = (page - 1) * limit;

    const conversations = await prisma.conversation.findMany({
      where,
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
      include: {
        participantOne: { select: { id: true, firstName: true, lastName: true, avatar: true, isVerifiedSeller: true } },
        participantTwo: { select: { id: true, firstName: true, lastName: true, avatar: true, isVerifiedSeller: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      }
    });

    res.json({ conversations, total, page, limit });
  } catch (error) {
    next(error);
  }
};

export const handleGetConversationMessages: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const { conversationId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 50;

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversation || (conversation.participantOneId !== userId && conversation.participantTwoId !== userId)) {
      return res.status(404).json({
        error: "Conversation not found or access denied",
        statusCode: 404,
      });
    }

    // Mark messages as read
    await prisma.message.updateMany({
      where: { conversationId, receiverId: userId, isRead: false },
      data: { isRead: true }
    });

    const skip = (page - 1) * limit;
    const total = await prisma.message.count({ where: { conversationId } });

    const messages = await prisma.message.findMany({
      where: { conversationId },
      skip,
      take: limit,
      orderBy: { createdAt: "asc" },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, avatar: true, isVerifiedSeller: true } },
        receiver: { select: { id: true, firstName: true, lastName: true, avatar: true, isVerifiedSeller: true } },
      }
    });

    res.json({
      conversation,
      messages,
      total,
      page,
      limit,
    });
  } catch (error) {
    next(error);
  }
};

export const handleSendMessage: RequestHandler = async (req, res, next) => {
  try {
    const senderId = (req as any).userId;
    const input = createMessageSchema.parse(req.body);

    const receiver = await prisma.user.findUnique({ where: { id: input.receiverId } });
    if (!receiver) {
      return res.status(404).json({
        error: "Recipient not found",
        statusCode: 404,
      });
    }

    // Find existing conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { participantOneId: senderId, participantTwoId: input.receiverId },
          { participantOneId: input.receiverId, participantTwoId: senderId },
        ]
      }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participantOneId: senderId,
          participantTwoId: input.receiverId,
        }
      });
    }

    const message = await prisma.message.create({
      data: {
        content: input.content,
        senderId,
        receiverId: input.receiverId,
        listingId: input.listingId,
        conversationId: conversation.id,
      },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, avatar: true, isVerifiedSeller: true } },
        receiver: { select: { id: true, firstName: true, lastName: true, avatar: true, isVerifiedSeller: true } },
      }
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessage: input.content,
        lastMessageAt: new Date(),
        isActive: true, // reactivate if deleted
      }
    });

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

export const handleMarkMessageAsRead: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const { messageId } = req.params;

    const message = await prisma.message.findUnique({
      where: { id: messageId }
    });

    if (!message) {
      return res.status(404).json({
        error: "Message not found",
        statusCode: 404,
      });
    }

    if (message.receiverId !== userId) {
      return res.status(403).json({
        error: "You don't have permission to mark this message as read",
        statusCode: 403,
      });
    }

    const updated = await prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, avatar: true, isVerifiedSeller: true } }
      }
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const handleDeleteConversation: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const { conversationId } = req.params;

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversation || (conversation.participantOneId !== userId && conversation.participantTwoId !== userId)) {
      return res.status(404).json({
        error: "Conversation not found or access denied",
        statusCode: 404,
      });
    }

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { isActive: false }
    });

    res.json({ message: "Conversation deleted" });
  } catch (error) {
    next(error);
  }
};

router.get("/", authRequired, handleGetConversations);
router.get("/:conversationId", authRequired, handleGetConversationMessages);
router.post("/", authRequired, handleSendMessage);
router.patch("/:messageId/read", authRequired, handleMarkMessageAsRead);
router.delete("/:conversationId", authRequired, handleDeleteConversation);

export default router;
