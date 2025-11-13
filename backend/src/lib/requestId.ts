import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

/**
 * Middleware to attach a unique request ID to every incoming request.
 * Adds:
 *   - req.id (string)
 *   - res.locals.requestId (string)
 *   - X-Request-Id response header
 */
export const requestId = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Reuse existing header if provided by upstream proxy/load balancer
    const incomingId = req.header("X-Request-Id");
    const id = incomingId || randomUUID();

    // Attach to req and res for downstream middlewares/loggers
    (req as any).id = id;
    res.locals.requestId = id;

    // Include it in response headers
    res.setHeader("X-Request-Id", id);

    next();
  };
};
