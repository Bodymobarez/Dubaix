import { Router, RequestHandler } from "express";
import { createListingSchema, updateListingSchema } from "../../shared/api";
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

export const handleGetMyListings: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const status = req.query.status as string | undefined;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const where = {
      sellerId: userId,
      ...(status && { status }),
    };

    const total = await prisma.listing.count({ where });
    const listings = await prisma.listing.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        seller: {
          select: { id: true, firstName: true, lastName: true, avatar: true, rating: true, isVerifiedSeller: true }
        }
      }
    });

    res.json({
      listings,
      total,
      page,
      limit,
    });
  } catch (error) {
    next(error);
  }
};

export const handleCreateListing: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const input = createListingSchema.parse(req.body);

    const listing = await prisma.listing.create({
      data: {
        title: input.title,
        description: input.description,
        categoryId: input.categoryId,
        price: input.price,
        currency: "AED",
        location: input.location,
        details: input.details || {},
        images: input.images || [],
        status: "active",
        sellerId: userId,
        latitude: input.latitude,
        longitude: input.longitude,
      },
      include: {
        seller: {
          select: { id: true, firstName: true, lastName: true, avatar: true, rating: true, isVerifiedSeller: true }
        }
      }
    });

    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const handleGetMyListing: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const listing = await prisma.listing.findFirst({
      where: { id, sellerId: userId },
      include: {
        seller: {
          select: { id: true, firstName: true, lastName: true, avatar: true, rating: true, isVerifiedSeller: true }
        }
      }
    });

    if (!listing) {
      return res.status(404).json({
        error: "Listing not found or you don't have permission to view it",
        statusCode: 404,
      });
    }

    res.json(listing);
  } catch (error) {
    next(error);
  }
};

export const handleUpdateListing: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const existing = await prisma.listing.findFirst({
      where: { id, sellerId: userId }
    });

    if (!existing) {
      return res.status(404).json({
        error: "Listing not found or you don't have permission to update it",
        statusCode: 404,
      });
    }

    const input = updateListingSchema.parse(req.body);

    const updated = await prisma.listing.update({
      where: { id },
      data: {
        ...(input.title && { title: input.title }),
        ...(input.description && { description: input.description }),
        ...(input.price !== undefined && { price: input.price }),
        ...(input.location && { location: input.location }),
        ...(input.categoryId && { categoryId: input.categoryId }),
        ...(input.details && { details: input.details }),
        ...(input.images && { images: input.images }),
        ...(input.latitude !== undefined && { latitude: input.latitude }),
        ...(input.longitude !== undefined && { longitude: input.longitude }),
      },
      include: {
        seller: {
          select: { id: true, firstName: true, lastName: true, avatar: true, rating: true, isVerifiedSeller: true }
        }
      }
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const handleUpdateListingStatus: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "sold", "removed", "expired"].includes(status)) {
      return res.status(400).json({ error: "Invalid status", statusCode: 400 });
    }

    const existing = await prisma.listing.findFirst({
      where: { id, sellerId: userId }
    });

    if (!existing) {
      return res.status(404).json({
        error: "Listing not found or you don't have permission to update it",
        statusCode: 404,
      });
    }

    const updated = await prisma.listing.update({
      where: { id },
      data: { status },
      include: {
        seller: {
          select: { id: true, firstName: true, lastName: true, avatar: true, rating: true, isVerifiedSeller: true }
        }
      }
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const handleDeleteListing: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const existing = await prisma.listing.findFirst({
      where: { id, sellerId: userId }
    });

    if (!existing) {
      return res.status(404).json({
        error: "Listing not found or you don't have permission to delete it",
        statusCode: 404,
      });
    }

    await prisma.listing.delete({ where: { id } });
    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const handleGetListingStats: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const listing = await prisma.listing.findFirst({
      where: { id, sellerId: userId }
    });

    if (!listing) {
      return res.status(404).json({ error: "Listing not found", statusCode: 404 });
    }

    res.json({
      views: listing.views,
      saved: 0,
      messages: 0,
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
    });
  } catch (error) {
    next(error);
  }
};

router.get("/", authRequired, handleGetMyListings);
router.post("/", authRequired, handleCreateListing);
router.get("/:id", authRequired, handleGetMyListing);
router.put("/:id", authRequired, handleUpdateListing);
router.patch("/:id/status", authRequired, handleUpdateListingStatus);
router.delete("/:id", authRequired, handleDeleteListing);
router.get("/:id/stats", authRequired, handleGetListingStats);

export default router;
