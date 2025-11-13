// backend/src/middleware/validate.ts
import { ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";
export const validate =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ error: "Validation failed", details: parsed.error.flatten() });
    }
    req.body = parsed.data;
    next();
  };
