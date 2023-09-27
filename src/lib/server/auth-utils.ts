import { AuthData } from "@/contexts/AuthContext";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function signToken(data: AuthData, options?: jwt.SignOptions) {
  if (JWT_SECRET === undefined) throw new Error("JWT_SECRET is undefined");
  return jwt.sign(data, JWT_SECRET, options);
}

export function verifyToken(token: string): AuthData {
  if (JWT_SECRET === undefined) throw new Error("JWT_SECRET is undefined");
  return jwt.verify(token, JWT_SECRET) as AuthData;
}
