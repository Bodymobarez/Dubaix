import { Router, RequestHandler } from "express";
import { createMessageSchema } from "../../shared/api";
import { getUserIdFromToken, getUserById } from "./auth";
import crypto from "crypto";

const router = Router();

// ============================================
// In-memory storage
// ============================================
interface StoredMessage {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  listingId: string;
  conversationId: string;
  isRead: boolean;
  createdAt: Date;
}

interface StoredConversation {
  id: string;
  participantOneId: string;
  participantTwoId: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messagesStore = new Map<string, StoredMessage>();
const conversationsStore = new Map<string, StoredConversation>();

// ============================================
// Middleware
// ============================================
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

// ============================================
// Helpers
// ============================================
function getUserInfo(userId: string) {
  const user = getUserById(userId);
  if (!user) return null;
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar,
    isVerifiedSeller: user.isVerifiedSeller,
  };
}

// ============================================
// GET /api/messages (conversations list)
// ============================================
export const handleGetConversations: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const userConversations = Array.from(conversationsStore.values())
    .filter(
      (c) =>
        c.isActive &&
        (c.participantOneId === userId || c.participantTwoId === userId)
    )
    .sort(
      (a, b) =>
        (b.lastMessageAt?.getTime() || b.createdAt.getTime()) -
        (a.lastMessageAt?.getTime() || a.createdAt.getTime())
    );

  const total = userConversations.length;
  const start = (page - 1) * limit;
  const paginated = userConversations.slice(start, start + limit);

  const enriched = paginated.map((c) => ({
    ...c,
    participantOne: getUserInfo(c.participantOneId),
    participantTwo: getUserInfo(c.participantTwoId),
    messages: Array.from(messagesStore.values())
      .filter((m) => m.conversationId === c.id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 1),
  }));

  res.json({ conversations: enriched, total, page, limit });
};

// ============================================
// GET /api/messages/:conversationId
// ============================================
export const handleGetConversationMessages: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { conversationId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 50;

  const conversation = conversationsStore.get(conversationId);

  if (
    !conversation ||
    (conversation.participantOneId !== userId &&
      conversation.participantTwoId !== userId)
  ) {
    return res.status(404).json({
      error: "Conversation not found or access denied",
      statusCode: 404,
    });
  }

  const conversationMessages = Array.from(messagesStore.values())
    .filter((m) => m.conversationId === conversationId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  // Mark messages as read
  conversationMessages
    .filter((m) => m.receiverId === userId && !m.isRead)
    .forEach((m) => {
      m.isRead = true;
      messagesStore.set(m.id, m);
    });

  const total = conversationMessages.length;
  const start = (page - 1) * limit;
  const paginated = conversationMessages.slice(start, start + limit);

  const enriched = paginated.map((m) => ({
    ...m,
    sender: getUserInfo(m.senderId),
    receiver: getUserInfo(m.receiverId),
  }));

  res.json({
    conversation,
    messages: enriched,
    total,
    page,
    limit,
  });
};

// ============================================
// POST /api/messages
// ============================================
export const handleSendMessage: RequestHandler = (req, res, next) => {
  try {
    const senderId = (req as any).userId;
    const input = createMessageSchema.parse(req.body);

    // Verify receiver exists
    const receiver = getUserById(input.receiverId);
    if (!receiver) {
      return res.status(404).json({
        error: "Recipient not found",
        statusCode: 404,
      });
    }

    // Find or create conversation
    let conversation = Array.from(conversationsStore.values()).find(
      (c) =>
        (c.participantOneId === senderId &&
          c.participantTwoId === input.receiverId) ||
        (c.participantOneId === input.receiverId &&
          c.participantTwoId === senderId)
    );

    if (!conversation) {
      conversation = {
        id: `conv_${crypto.randomBytes(8).toString("hex")}`,
        participantOneId: senderId,
        participantTwoId: input.receiverId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      conversationsStore.set(conversation.id, conversation);
    }

    // Create message
    const message: StoredMessage = {
      id: `msg_${crypto.randomBytes(8).toString("hex")}`,
      content: input.content,
      senderId,
      receiverId: input.receiverId,
      listingId: input.listingId,
      conversationId: conversation.id,
      isRead: false,
      createdAt: new Date(),
    };

    messagesStore.set(message.id, message);

    // Update conversation
    conversation.lastMessage = input.content;
    conversation.lastMessageAt = new Date();
    conversation.updatedAt = new Date();
    conversationsStore.set(conversation.id, conversation);

    res.status(201).json({
      ...message,
      sender: getUserInfo(senderId),
      receiver: getUserInfo(input.receiverId),
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// PATCH /api/messages/:messageId/read
// ============================================
export const handleMarkMessageAsRead: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { messageId } = req.params;
  const message = messagesStore.get(messageId);

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

  message.isRead = true;
  messagesStore.set(messageId, message);

  res.json({
    ...message,
    sender: getUserInfo(message.senderId),
  });
};

// ============================================
// DELETE /api/messages/:conversationId
// ============================================
export const handleDeleteConversation: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { conversationId } = req.params;
  const conversation = conversationsStore.get(conversationId);

  if (
    !conversation ||
    (conversation.participantOneId !== userId &&
      conversation.participantTwoId !== userId)
  ) {
    return res.status(404).json({
      error: "Conversation not found or access denied",
      statusCode: 404,
    });
  }

  conversation.isActive = false;
  conversationsStore.set(conversationId, conversation);

  res.json({ message: "Conversation deleted" });
};

// Register routes
router.get("/", authRequired, handleGetConversations);
router.get("/:conversationId", authRequired, handleGetConversationMessages);
router.post("/", authRequired, handleSendMessage);
router.patch("/:messageId/read", authRequired, handleMarkMessageAsRead);
router.delete("/:conversationId", authRequired, handleDeleteConversation);

export default router;
