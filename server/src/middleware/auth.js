import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { unauthorized } from "../utils/httpError.js";

function readUserId(req) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  try {
    return jwt.verify(token, env.jwtSecret).sub;
  } catch {
    return null;
  }
}

// Route needs a logged-in user.
export function requireAuth(req, _res, next) {
  const userId = readUserId(req);
  if (!userId) throw unauthorized();
  req.userId = userId;
  next();
}

// Route works for everyone, but personalises results when logged in.
export function optionalAuth(req, _res, next) {
  req.userId = readUserId(req);
  next();
}

export function signToken(userId) {
  return jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: "7d" });
}
