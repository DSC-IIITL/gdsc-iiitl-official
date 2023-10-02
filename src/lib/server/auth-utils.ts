import { AuthData } from "@/contexts/AuthContext";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

export function signToken(data: AuthData, options?: jwt.SignOptions) {
  if (JWT_SECRET === undefined) throw new Error("JWT_SECRET is undefined");
  return jwt.sign(data, JWT_SECRET, options);
}

export function verifyToken(token: string): AuthData {
  if (JWT_SECRET === undefined) throw new Error("JWT_SECRET is undefined");
  return jwt.verify(token, JWT_SECRET) as AuthData;
}

export function checkAuth(
  request: NextRequest,
  callback: (authData: AuthData) => boolean
) {
  const token = request.cookies.get("token")?.value;
  if (token === undefined) return false;
  const authData = verifyToken(token);
  return callback(authData);
}
