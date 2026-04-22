import { Router, RequestHandler } from "express";
import { registerSchema, loginSchema } from "../../shared/api";
import crypto from "crypto";

const router = Router();

// ============================================
// In-memory user store (works without Prisma/DB)
// ============================================
interface StoredUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  rating: number;
  totalReviews: number;
  isVerifiedSeller: boolean;
  isAdmin: boolean;
  createdAt: Date;
}

// Token -> userId mapping
const tokenStore = new Map<string, string>();

// Users store (email -> user)
const usersStore = new Map<string, StoredUser>();

// ============================================
// SEED: Default admin user
// ============================================
const adminUser: StoredUser = {
  id: "admin_001",
  email: "admin@dubaix.com",
  password: "Admin@123",
  firstName: "Admin",
  lastName: "Dubaix",
  avatar: undefined,
  bio: "Dubaix Marketplace Administrator",
  rating: 5.0,
  totalReviews: 0,
  isVerifiedSeller: true,
  isAdmin: true,
  createdAt: new Date(),
};

usersStore.set(adminUser.email, adminUser);
console.log("✅ Admin user seeded: admin@dubaix.com / Admin@123");

// ============================================
// Helpers
// ============================================
function generateToken(): string {
  return crypto.randomBytes(48).toString("hex");
}

function sanitizeUser(user: StoredUser) {
  // Return user without password
  const { password, ...safeUser } = user;
  return safeUser;
}

// ============================================
// POST /api/auth/register
// ============================================
export const handleRegister: RequestHandler = (req, res, next) => {
  try {
    const input = registerSchema.parse(req.body);

    // Check if email already exists
    if (usersStore.has(input.email)) {
      return res.status(400).json({
        error: "Email already registered",
        statusCode: 400,
      });
    }

    // Create user
    const newUser: StoredUser = {
      id: `user_${crypto.randomBytes(8).toString("hex")}`,
      email: input.email,
      password: input.password,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      rating: 5.0,
      totalReviews: 0,
      isVerifiedSeller: false,
      isAdmin: false,
      createdAt: new Date(),
    };

    usersStore.set(newUser.email, newUser);

    // Generate token
    const token = generateToken();
    tokenStore.set(token, newUser.id);

    res.status(201).json({
      user: sanitizeUser(newUser),
      token,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// POST /api/auth/login
// ============================================
export const handleLogin: RequestHandler = (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);

    // Find user by email
    const user = usersStore.get(input.email);

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
        statusCode: 401,
      });
    }

    // Verify password (plain comparison — no bcrypt in dev)
    if (user.password !== input.password) {
      return res.status(401).json({
        error: "Invalid email or password",
        statusCode: 401,
      });
    }

    // Generate token
    const token = generateToken();
    tokenStore.set(token, user.id);

    res.json({
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET /api/auth/me
// ============================================
export const handleGetMe: RequestHandler = (req, res) => {
  const token = (req as any).token;

  if (!token) {
    return res.status(401).json({
      error: "Unauthorized - no token provided",
      statusCode: 401,
    });
  }

  const userId = tokenStore.get(token);
  if (!userId) {
    return res.status(401).json({
      error: "Invalid or expired token",
      statusCode: 401,
    });
  }

  // Find user by ID
  let foundUser: StoredUser | undefined;
  for (const user of usersStore.values()) {
    if (user.id === userId) {
      foundUser = user;
      break;
    }
  }

  if (!foundUser) {
    return res.status(404).json({
      error: "User not found",
      statusCode: 404,
    });
  }

  res.json({ user: sanitizeUser(foundUser) });
};

// ============================================
// POST /api/auth/logout
// ============================================
export const handleLogout: RequestHandler = (req, res) => {
  const token = (req as any).token;

  if (token) {
    tokenStore.delete(token);
  }

  res.json({ message: "Logged out successfully" });
};

// ============================================
// Export for use in auth middleware
// ============================================
export function getUserIdFromToken(token: string): string | undefined {
  return tokenStore.get(token);
}

export function getUserById(userId: string): StoredUser | undefined {
  for (const user of usersStore.values()) {
    if (user.id === userId) {
      return user;
    }
  }
  return undefined;
}

// Register routes
router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.get("/me", handleGetMe);
router.post("/logout", handleLogout);

export default router;
