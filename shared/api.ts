/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

import { z } from "zod";

// ============================================
// DEMO (kept for reference)
// ============================================
export interface DemoResponse {
  message: string;
}

// ============================================
// AUTH SCHEMAS
// ============================================
export const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string(),
});

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  rating: z.number(),
  totalReviews: z.number(),
  isVerifiedSeller: z.boolean(),
  createdAt: z.date(),
});

export type User = z.infer<typeof userSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export interface AuthResponse {
  user: User;
  token: string;
}

// ============================================
// CATEGORY SCHEMAS
// ============================================
export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  nameAr: z.string(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  icon: z.string().optional(),
  slug: z.string(),
});

export type Category = z.infer<typeof categorySchema>;

// ============================================
// LISTING SCHEMAS
// ============================================
export const listingDetailSchema = z.object({
  // Car specific details (extensible for other categories)
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.string().optional(),
  mileage: z.string().optional(),
  transmission: z.enum(["manual", "automatic"]).optional(),
  fuel: z.enum(["petrol", "diesel", "electric", "hybrid"]).optional(),
  
  // Property specific
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  squareFeet: z.number().optional(),
  
  // Generic details
  condition: z.enum(["new", "like_new", "excellent", "good", "fair"]).optional(),
  brand: z.string().optional(),
});

export const createListingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  description: z.string().min(20, "Description must be at least 20 characters").max(5000),
  categoryId: z.string(),
  price: z.number().positive("Price must be positive"),
  location: z.string().min(3, "Location required"),
  details: listingDetailSchema.optional(),
  images: z.array(z.string()).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const listingSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  categoryId: z.string(),
  category: categorySchema.optional(),
  price: z.number(),
  currency: z.string(),
  location: z.string(),
  details: z.record(z.any()).optional(),
  images: z.array(z.string()),
  status: z.enum(["active", "sold", "removed", "expired"]),
  featured: z.boolean(),
  boosted: z.boolean(),
  views: z.number(),
  seller: userSchema.optional(),
  sellerId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  expiresAt: z.date().optional(),
});

export const updateListingSchema = createListingSchema.partial();

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type Listing = z.infer<typeof listingSchema>;
export type ListingDetail = z.infer<typeof listingDetailSchema>;

export interface ListingsResponse {
  listings: Listing[];
  total: number;
  page: number;
  limit: number;
}

export interface ListingDetailResponse {
  listing: Listing;
  relatedListings: Listing[];
  seller: User;
}

// ============================================
// SEARCH & FILTER SCHEMAS
// ============================================
export const searchFiltersSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  location: z.string().optional(),
  sortBy: z.enum(["newest", "price_low", "price_high", "most_viewed"]).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(20),
});

export type SearchFilters = z.infer<typeof searchFiltersSchema>;

// ============================================
// MESSAGE SCHEMAS
// ============================================
export const messageSchema = z.object({
  id: z.string(),
  content: z.string(),
  senderId: z.string(),
  sender: userSchema.optional(),
  receiverId: z.string(),
  receiver: userSchema.optional(),
  listingId: z.string(),
  conversationId: z.string(),
  isRead: z.boolean(),
  createdAt: z.date(),
});

export const createMessageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(5000),
  receiverId: z.string(),
  listingId: z.string(),
});

export const conversationSchema = z.object({
  id: z.string(),
  participantOneId: z.string(),
  participantTwoId: z.string(),
  messages: z.array(messageSchema).optional(),
  lastMessage: z.string().optional(),
  lastMessageAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Message = z.infer<typeof messageSchema>;
export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type Conversation = z.infer<typeof conversationSchema>;

export interface ConversationsResponse {
  conversations: Conversation[];
  total: number;
}

// ============================================
// REVIEW SCHEMAS
// ============================================
export const reviewSchema = z.object({
  id: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
  authorId: z.string(),
  author: userSchema.optional(),
  subjectId: z.string(),
  listingId: z.string(),
  createdAt: z.date(),
});

export const createReviewSchema = z.object({
  rating: z.number().int().min(1, "Rating must be 1-5").max(5, "Rating must be 1-5"),
  comment: z.string().max(1000).optional(),
  subjectId: z.string(),
  listingId: z.string(),
});

export type Review = z.infer<typeof reviewSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;

// ============================================
// SAVED LISTING SCHEMAS
// ============================================
export const savedListingSchema = z.object({
  id: z.string(),
  userId: z.string(),
  listingId: z.string(),
  listing: listingSchema.optional(),
  createdAt: z.date(),
});

export type SavedListing = z.infer<typeof savedListingSchema>;

// ============================================
// ERROR RESPONSE SCHEMA
// ============================================
export const errorResponseSchema = z.object({
  error: z.string(),
  statusCode: z.number(),
  details: z.any().optional(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
