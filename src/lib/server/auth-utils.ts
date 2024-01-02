import { AuthData } from "@/contexts/AuthContext";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

export function signToken(data: AuthData, options?: jwt.SignOptions) {
  if (JWT_SECRET === undefined) throw new Error("JWT_SECRET is undefined");
  return jwt.sign(data, JWT_SECRET, options);
}

export function verifyToken(
  token: string,
  verify: (authData: AuthData) => boolean = () => true
) {
  const authData = getAuthData(token);
  return verify(authData);
}

export function getAuthData(token: string | undefined): AuthData {
  if (JWT_SECRET === undefined) throw new Error("JWT_SECRET is undefined");
  if (token === undefined) throw new Error("Token is undefined");
  const authData = jwt.verify(token, JWT_SECRET) as AuthData;
  return authData;
}

export function checkAuth(
  request: NextRequest,
  callback: (authData: AuthData) => boolean
) {
  const token = request.cookies.get("token")?.value;
  if (token === undefined) return false;
  const authData = getAuthData(token);
  return callback(authData);
}
