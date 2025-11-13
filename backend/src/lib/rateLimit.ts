// backend/src/lib/rateLimit.ts
import rateLimit from "express-rate-limit";

export const rateLimiter = (opts?: { windowMs?: number; max?: number }) =>
  rateLimit({
    windowMs: opts?.windowMs ?? 60_000,
    max: opts?.max ?? 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please slow down." }
  });
