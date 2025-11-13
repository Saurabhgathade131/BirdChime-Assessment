// backend/src/middleware/error.ts
import { Request, Response, NextFunction } from "express";
export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  return res.status(status).json({ error: err.message || "Server error" });
};
