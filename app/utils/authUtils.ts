import { prisma } from "../../app/utils/prisma.server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { userModel } from "@/prisma/zod/user";
import { z } from "zod";

// Load environment variables
dotenv.config();

export type User = z.infer<typeof userModel>;

// Retrieve the JWT secret key from the environment variables
const JWT_SECRET: string = process.env.JWT_SECRET || "";

// Generate a JWT token
export const generateToken = (user: User): string => {
  const payload = { user };
  const options = { expiresIn: "1d" }; // Token expiration time 1h | 1d
  return jwt.sign(payload, JWT_SECRET, options);
};

// Verify a JWT token and return the decoded payload
export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};

// Hashes the plain password using bcrypt
export const hashPassword = async (plainPassword: string): Promise<string> => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(plainPassword, salt);
  return hash;
};

// Compares the plain password with the stored hash
export const comparePassword = async (
  plainPassword: string,
  storedHash: string
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(plainPassword, storedHash);
  return isMatch;
};

// Middleware to authenticate incoming requests
export default function authMiddleware(handler: any) {
  return async (req: any, res: any) => {
    // Check for the presence of the JWT token in the request headers or cookies.
    const token = req.headers.authorization || req.cookies.token;

    if (!token) {
      // Handle unauthorized requests.
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      // Verify the JWT token and extract its payload.
      const decoded = verifyToken(token);
      req.user = decoded.user; // Attach the user information to the request object.
      return handler(req, res);
    } catch (err) {
      // Handle invalid tokens or other errors.
      return res.status(401).json({ error: "Invalid token" });
    }
  };
}

// Create a new user in the database
export const createUser = async (request: User): Promise<void> => {
  const hashedPassword = await hashPassword(request.password);
  await prisma.user.create({
    data: {
      first_name: request.first_name,
      middle_name: request.middle_name,
      last_name: request.last_name,
      email: request.email,
      mobile_no: request.mobile_no,
      password: hashedPassword,
      role_id: request.role_id,
      employee_id: request.employee_id,
      status: request.status,
    },
  });
};

// Find a user by email
export const findUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export function generateAndStoreOTP(email: string): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`Generated OTP ${otp} for email ${email}`);
  return otp;
}
