import { Router, RequestHandler } from "express";
import { registerSchema, loginSchema } from "../../shared/api";
import crypto from "crypto";
import { prisma } from "../index";

const router = Router();

// Token -> userId mapping
const tokenStore = new Map<string, string>();

function generateToken(): string {
  return crypto.randomBytes(48).toString("hex");
}

function sanitizeUser(user: any) {
  // Return user without password
  const { password, ...safeUser } = user;
  return safeUser;
}

export const handleRegister: RequestHandler = async (req, res, next) => {
  try {
    const input = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: input.email }
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Email already registered",
        statusCode: 400,
      });
    }

    const newUser = await prisma.user.create({
      data: {
        email: input.email,
        password: input.password,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
      }
    });

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

export const handleLogin: RequestHandler = async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: input.email }
    });

    if (!user || user.password !== input.password) {
      return res.status(401).json({
        error: "Invalid email or password",
        statusCode: 401,
      });
    }

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

export const handleGetMe: RequestHandler = async (req, res, next) => {
  try {
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

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        statusCode: 404,
      });
    }

    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

export const handleLogout: RequestHandler = (req, res) => {
  const token = (req as any).token;

  if (token) {
    tokenStore.delete(token);
  }

  res.json({ message: "Logged out successfully" });
};

export function getUserIdFromToken(token: string): string | undefined {
  return tokenStore.get(token);
}

// Register routes
router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.get("/me", handleGetMe);
router.post("/logout", handleLogout);

export default router;
