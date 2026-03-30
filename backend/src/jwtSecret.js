/** Shared secret for admin + user JWTs. */
export function getJwtSecret() {
  const s = process.env.JWT_SECRET?.trim();
  if (s) return s;
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[auth] JWT_SECRET is not set; using insecure dev default. Set JWT_SECRET in backend/.env"
    );
    return "dev-insecure-jwt-secret-change-me";
  }
  throw new Error("JWT_SECRET is required in production");
}
