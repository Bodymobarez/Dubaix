import { Router, RequestHandler } from "express";
import { searchFiltersSchema } from "../../shared/api";
import { listingsStore, type StoredListing } from "./my-listings";
import { getUserById } from "./auth";

const router = Router();

// Helper to enrich listing with seller info
function enrichListing(listing: StoredListing) {
  const seller = getUserById(listing.sellerId);
  return {
    ...listing,
    price: `AED ${listing.price.toLocaleString()}`,
    seller: seller
      ? {
          id: seller.id,
          email: seller.email,
          firstName: seller.firstName,
          lastName: seller.lastName,
          avatar: seller.avatar,
          rating: seller.rating,
          totalReviews: seller.totalReviews,
          isVerifiedSeller: seller.isVerifiedSeller,
        }
      : undefined,
  };
}

/**
 * GET /api/listings
 * Fetch listings with advanced filtering and search
 */
export const handleGetListings: RequestHandler = (req, res, next) => {
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

    let results = Array.from(listingsStore.values()).filter(
      (l) => l.status === "active"
    );

    // Search filter
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (filters.categoryId) {
      results = results.filter((l) => l.categoryId === filters.categoryId);
    }

    // Price range filter
    if (filters.minPrice) {
      results = results.filter((l) => l.price >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      results = results.filter((l) => l.price <= filters.maxPrice!);
    }

    // Location filter
    if (filters.location) {
      const loc = filters.location.toLowerCase();
      results = results.filter((l) =>
        l.location.toLowerCase().includes(loc)
      );
    }

    // Sort
    if (filters.sortBy === "price_low") {
      results.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === "price_high") {
      results.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === "most_viewed") {
      results.sort((a, b) => b.views - a.views);
    } else {
      results.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    const total = results.length;
    const start = (filters.page - 1) * filters.limit;
    const paginated = results.slice(start, start + filters.limit);

    res.json({
      listings: paginated.map(enrichListing),
      total,
      page: filters.page,
      limit: filters.limit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/listings/:id
 * Fetch single listing with seller info
 */
export const handleGetListingDetail: RequestHandler = (req, res) => {
  const { id } = req.params;
  const listing = listingsStore.get(id);

  if (!listing) {
    return res.status(404).json({
      error: "Listing not found",
      statusCode: 404,
    });
  }

  // Increment view count
  listing.views += 1;
  listingsStore.set(id, listing);

  // Fetch related listings from same category
  const relatedListings = Array.from(listingsStore.values())
    .filter(
      (l) =>
        l.categoryId === listing.categoryId &&
        l.id !== id &&
        l.status === "active"
    )
    .slice(0, 4)
    .map(enrichListing);

  const seller = getUserById(listing.sellerId);

  res.json({
    listing: enrichListing(listing),
    relatedListings,
    seller: seller
      ? {
          id: seller.id,
          email: seller.email,
          firstName: seller.firstName,
          lastName: seller.lastName,
          avatar: seller.avatar,
          bio: seller.bio,
          rating: seller.rating,
          totalReviews: seller.totalReviews,
          isVerifiedSeller: seller.isVerifiedSeller,
          createdAt: seller.createdAt,
        }
      : null,
  });
};

/**
 * GET /api/listings/category/:categoryId
 * Fetch listings by category
 */
export const handleGetListingsByCategory: RequestHandler = (req, res) => {
  const { categoryId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const results = Array.from(listingsStore.values())
    .filter((l) => l.categoryId === categoryId && l.status === "active")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const total = results.length;
  const start = (page - 1) * limit;

  res.json({
    listings: results.slice(start, start + limit).map(enrichListing),
    total,
    page,
    limit,
  });
};

/**
 * GET /api/listings/featured
 * Fetch featured listings
 */
export const handleGetFeaturedListings: RequestHandler = (_req, res) => {
  const featured = Array.from(listingsStore.values())
    .filter((l) => l.featured && l.status === "active")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 8)
    .map(enrichListing);

  res.json({ listings: featured });
};

// Register routes
router.get("/", handleGetListings);
router.get("/featured", handleGetFeaturedListings);
router.get("/category/:categoryId", handleGetListingsByCategory);
router.get("/:id", handleGetListingDetail);

export default router;
