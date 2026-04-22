import { Router, RequestHandler } from "express";
import { searchFiltersSchema } from "../../shared/api";
import { prisma } from "../index";

const router = Router();

export const handleGetListings: RequestHandler = async (req, res, next) => {
  try {
    const filters = searchFiltersSchema.parse({
      search: req.query.search as string | undefined,
      categoryId: req.query.categoryId as string | undefined,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      location: req.query.location as string | undefined,
      sortBy: req.query.sortBy as string | undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
    });

    const where: any = { status: "active" };

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
      if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
    }

    if (filters.location) {
      where.location = { contains: filters.location, mode: "insensitive" };
    }

    let orderBy: any = { createdAt: "desc" };
    if (filters.sortBy === "price_low") orderBy = { price: "asc" };
    else if (filters.sortBy === "price_high") orderBy = { price: "desc" };
    else if (filters.sortBy === "most_viewed") orderBy = { views: "desc" };

    const start = (filters.page - 1) * filters.limit;

    const total = await prisma.listing.count({ where });
    const listings = await prisma.listing.findMany({
      where,
      skip: start,
      take: filters.limit,
      orderBy,
      include: {
        seller: {
          select: { id: true, email: true, firstName: true, lastName: true, avatar: true, rating: true, totalReviews: true, isVerifiedSeller: true }
        }
      }
    });

    res.json({
      listings: listings.map(l => ({...l, price: `AED ${l.price.toLocaleString()}`})),
      total,
      page: filters.page,
      limit: filters.limit,
    });
  } catch (error) {
    next(error);
  }
};

export const handleGetListingDetail: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        seller: {
          select: { id: true, email: true, firstName: true, lastName: true, avatar: true, bio: true, rating: true, totalReviews: true, isVerifiedSeller: true, createdAt: true }
        }
      }
    });

    if (!listing) {
      return res.status(404).json({
        error: "Listing not found",
        statusCode: 404,
      });
    }

    // Increment view count
    await prisma.listing.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    const relatedListingsRaw = await prisma.listing.findMany({
      where: {
        categoryId: listing.categoryId,
        id: { not: id },
        status: "active",
      },
      take: 4,
      include: {
        seller: {
          select: { id: true, email: true, firstName: true, lastName: true, avatar: true, rating: true, totalReviews: true, isVerifiedSeller: true }
        }
      }
    });

    const enrichedListing = { ...listing, price: `AED ${listing.price.toLocaleString()}` };
    const relatedListings = relatedListingsRaw.map(l => ({ ...l, price: `AED ${l.price.toLocaleString()}` }));

    res.json({
      listing: enrichedListing,
      relatedListings,
      seller: listing.seller,
    });
  } catch (error) {
    next(error);
  }
};

export const handleGetListingsByCategory: RequestHandler = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const where = { categoryId, status: "active" };
    const total = await prisma.listing.count({ where });
    const start = (page - 1) * limit;

    const listings = await prisma.listing.findMany({
      where,
      skip: start,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        seller: {
          select: { id: true, email: true, firstName: true, lastName: true, avatar: true, rating: true, totalReviews: true, isVerifiedSeller: true }
        }
      }
    });

    res.json({
      listings: listings.map(l => ({...l, price: `AED ${l.price.toLocaleString()}`})),
      total,
      page,
      limit,
    });
  } catch (error) {
    next(error);
  }
};

export const handleGetFeaturedListings: RequestHandler = async (_req, res, next) => {
  try {
    const listings = await prisma.listing.findMany({
      where: { featured: true, status: "active" },
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        seller: {
          select: { id: true, email: true, firstName: true, lastName: true, avatar: true, rating: true, totalReviews: true, isVerifiedSeller: true }
        }
      }
    });

    res.json({ listings: listings.map(l => ({...l, price: `AED ${l.price.toLocaleString()}`})) });
  } catch (error) {
    next(error);
  }
};

router.get("/", handleGetListings);
router.get("/featured", handleGetFeaturedListings);
router.get("/category/:categoryId", handleGetListingsByCategory);
router.get("/:id", handleGetListingDetail);

export default router;
