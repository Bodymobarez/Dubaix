import { Router, RequestHandler } from "express";
import { createListingSchema, updateListingSchema } from "../../shared/api";
import { getUserIdFromToken, getUserById } from "./auth";
import crypto from "crypto";

const router = Router();

// ============================================
// In-memory listing store (works without Prisma/DB)
// ============================================
export interface StoredListing {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  price: number;
  currency: string;
  location: string;
  details: Record<string, any>;
  images: string[];
  status: "active" | "sold" | "removed" | "expired";
  featured: boolean;
  boosted: boolean;
  views: number;
  sellerId: string;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

// Shared in-memory listings store
export const listingsStore = new Map<string, StoredListing>();

// Seed demo listings for the admin user
const seedListings: StoredListing[] = [
  {
    id: "listing_001",
    title: "2023 Toyota Land Cruiser - Immaculate Condition",
    description:
      "Immaculate 2023 Toyota Land Cruiser with only 15,000 km on the odometer. Fully serviced, all original parts, never been in accident. Comes with full warranty transfer.\n\nFeatures:\n• Panoramic sunroof\n• Premium leather interior\n• Advanced safety features\n• Bluetooth connectivity\n• Rear camera and sensors\n• Cruise control\n• Climate control",
    categoryId: "motors",
    price: 185000,
    currency: "AED",
    location: "Dubai Marina, Dubai",
    details: {
      make: "Toyota",
      model: "Land Cruiser",
      year: "2023",
      mileage: "15,000 km",
      transmission: "automatic",
      fuel: "petrol",
    },
    images: [
      "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519641471654-76ce0107795f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1581917694597-4b9ff45b0fb0?w=800&h=600&fit=crop",
    ],
    status: "active",
    featured: true,
    boosted: false,
    views: 2451,
    sellerId: "admin_001",
    createdAt: new Date("2026-04-10"),
    updatedAt: new Date("2026-04-10"),
  },
  {
    id: "listing_002",
    title: "Luxury Apartment in Downtown Dubai",
    description:
      "Stunning 2-bedroom luxury apartment in the heart of Downtown Dubai. Floor-to-ceiling windows with breathtaking Burj Khalifa views. Premium finishes throughout, fully furnished.\n\n• 2 bedrooms, 2 bathrooms\n• 1,450 sq ft\n• High floor with panoramic views\n• Access to pool, gym, and spa\n• Underground parking",
    categoryId: "property",
    price: 3200000,
    currency: "AED",
    location: "Downtown Dubai, Dubai",
    details: {
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1450,
      condition: "like_new",
    },
    images: [
      "https://images.unsplash.com/photo-1545457529-d1e8a9a2cc8f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    ],
    status: "active",
    featured: true,
    boosted: false,
    views: 5678,
    sellerId: "admin_001",
    createdAt: new Date("2026-04-05"),
    updatedAt: new Date("2026-04-05"),
  },
  {
    id: "listing_003",
    title: "iPhone 15 Pro Max 256GB - Natural Titanium",
    description:
      "Brand new iPhone 15 Pro Max 256GB in Natural Titanium. Sealed box, UAE purchased with Apple warranty. Includes all original accessories.\n\n• A17 Pro chip\n• 48MP camera system\n• Titanium design\n• USB-C\n• All-day battery life",
    categoryId: "electronics",
    price: 4299,
    currency: "AED",
    location: "Al Barsha, Dubai",
    details: {
      brand: "Apple",
      condition: "new",
    },
    images: [
      "https://images.unsplash.com/photo-1592286927505-1def25115558?w=800&h=600&fit=crop",
    ],
    status: "sold",
    featured: true,
    boosted: false,
    views: 8901,
    sellerId: "admin_001",
    createdAt: new Date("2026-04-08"),
    updatedAt: new Date("2026-04-12"),
  },
  {
    id: "listing_004",
    title: "Professional Web Development Services",
    description:
      "Full-stack web development services for businesses of all sizes. React, Node.js, and modern tech stack.\n\n• Custom web applications\n• E-commerce solutions\n• API development\n• UI/UX design\n• SEO optimization\n• Maintenance and support",
    categoryId: "services",
    price: 500,
    currency: "AED",
    location: "Abu Dhabi, UAE",
    details: {
      condition: "new",
    },
    images: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    ],
    status: "active",
    featured: true,
    boosted: false,
    views: 3412,
    sellerId: "admin_001",
    createdAt: new Date("2026-04-01"),
    updatedAt: new Date("2026-04-01"),
  },
];

// Seed listings into the store
seedListings.forEach((listing) => listingsStore.set(listing.id, listing));
console.log(`✅ Seeded ${seedListings.length} demo listings`);

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

// Helper to attach seller info to a listing
function enrichListing(listing: StoredListing) {
  const seller = getUserById(listing.sellerId);
  return {
    ...listing,
    seller: seller
      ? {
          id: seller.id,
          firstName: seller.firstName,
          lastName: seller.lastName,
          avatar: seller.avatar,
          rating: seller.rating,
          isVerifiedSeller: seller.isVerifiedSeller,
        }
      : undefined,
  };
}

// ============================================
// GET /api/my-listings
// ============================================
export const handleGetMyListings: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const status = req.query.status as string | undefined;

  const userListings = Array.from(listingsStore.values())
    .filter((l) => l.sellerId === userId)
    .filter((l) => (status ? l.status === status : true))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const start = (page - 1) * limit;

  res.json({
    listings: userListings.slice(start, start + limit).map(enrichListing),
    total: userListings.length,
    page,
    limit,
  });
};

// ============================================
// POST /api/my-listings
// ============================================
export const handleCreateListing: RequestHandler = (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const input = createListingSchema.parse(req.body);

    const listing: StoredListing = {
      id: `listing_${crypto.randomBytes(8).toString("hex")}`,
      title: input.title,
      description: input.description,
      categoryId: input.categoryId,
      price: input.price,
      currency: "AED",
      location: input.location,
      details: input.details || {},
      images: input.images || [],
      status: "active",
      featured: false,
      boosted: false,
      views: 0,
      sellerId: userId,
      latitude: input.latitude,
      longitude: input.longitude,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    listingsStore.set(listing.id, listing);
    res.status(201).json(enrichListing(listing));
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET /api/my-listings/:id
// ============================================
export const handleGetMyListing: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { id } = req.params;
  const listing = listingsStore.get(id);

  if (!listing || listing.sellerId !== userId) {
    return res.status(404).json({
      error: "Listing not found or you don't have permission to view it",
      statusCode: 404,
    });
  }

  res.json(enrichListing(listing));
};

// ============================================
// PUT /api/my-listings/:id
// ============================================
export const handleUpdateListing: RequestHandler = (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const existing = listingsStore.get(id);

    if (!existing || existing.sellerId !== userId) {
      return res.status(404).json({
        error: "Listing not found or you don't have permission to update it",
        statusCode: 404,
      });
    }

    const input = updateListingSchema.parse(req.body);

    const updated: StoredListing = {
      ...existing,
      ...(input.title && { title: input.title }),
      ...(input.description && { description: input.description }),
      ...(input.price !== undefined && { price: input.price }),
      ...(input.location && { location: input.location }),
      ...(input.categoryId && { categoryId: input.categoryId }),
      ...(input.details && { details: input.details }),
      ...(input.images && { images: input.images }),
      ...(input.latitude !== undefined && { latitude: input.latitude }),
      ...(input.longitude !== undefined && { longitude: input.longitude }),
      updatedAt: new Date(),
    };

    listingsStore.set(id, updated);
    res.json(enrichListing(updated));
  } catch (error) {
    next(error);
  }
};

// ============================================
// PATCH /api/my-listings/:id/status
// ============================================
export const handleUpdateListingStatus: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { id } = req.params;
  const { status } = req.body;

  if (!["active", "sold", "removed", "expired"].includes(status)) {
    return res.status(400).json({ error: "Invalid status", statusCode: 400 });
  }

  const existing = listingsStore.get(id);
  if (!existing || existing.sellerId !== userId) {
    return res.status(404).json({
      error: "Listing not found or you don't have permission to update it",
      statusCode: 404,
    });
  }

  existing.status = status;
  existing.updatedAt = new Date();
  listingsStore.set(id, existing);

  res.json(enrichListing(existing));
};

// ============================================
// DELETE /api/my-listings/:id
// ============================================
export const handleDeleteListing: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { id } = req.params;
  const existing = listingsStore.get(id);

  if (!existing || existing.sellerId !== userId) {
    return res.status(404).json({
      error: "Listing not found or you don't have permission to delete it",
      statusCode: 404,
    });
  }

  listingsStore.delete(id);
  res.json({ message: "Listing deleted successfully" });
};

// ============================================
// GET /api/my-listings/:id/stats
// ============================================
export const handleGetListingStats: RequestHandler = (req, res) => {
  const userId = (req as any).userId;
  const { id } = req.params;
  const listing = listingsStore.get(id);

  if (!listing || listing.sellerId !== userId) {
    return res.status(404).json({ error: "Listing not found", statusCode: 404 });
  }

  res.json({
    views: listing.views,
    saved: 0,
    messages: 0,
    createdAt: listing.createdAt,
    updatedAt: listing.updatedAt,
  });
};

// Register routes
router.get("/", authRequired, handleGetMyListings);
router.post("/", authRequired, handleCreateListing);
router.get("/:id", authRequired, handleGetMyListing);
router.put("/:id", authRequired, handleUpdateListing);
router.patch("/:id/status", authRequired, handleUpdateListingStatus);
router.delete("/:id", authRequired, handleDeleteListing);
router.get("/:id/stats", authRequired, handleGetListingStats);

export default router;
