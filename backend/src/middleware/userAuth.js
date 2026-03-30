import jwt from "jsonwebtoken";
import { getJwtSecret } from "../jwtSecret.js";

export function requireUser(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Нэвтрэх шаардлагатай" });
  }
  try {
    const payload = jwt.verify(token, getJwtSecret());
    if (payload.role !== "user" || !payload.sub) {
      return res.status(403).json({ error: "Forbidden" });
    }
    req.user = { userId: payload.sub, phone: payload.phone };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
