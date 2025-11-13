import express from "express";
import helmet from "helmet";
import cors from "cors";
import pinoHttp from "pino-http";
import { rateLimiter } from "./lib/rateLimit";
import { requestId } from "./lib/requestId";
import appointments from "./routes/appointments";
import health from "./routes/health";
import { errorHandler } from "./middleware/error";

export const createApp = () => {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? "*", credentials: true }));
  app.use(express.json({ limit: "100kb" }));
  app.use(requestId());
  app.use(pinoHttp()); // structured logs with req.id
  app.use('/', (req, res)=>{res.send("welcome")})
  app.use("/healthz", health.liveness);
  app.use("/readyz", health.readiness);

  // Global rate limit (burst-safe); per-route overrides possible
  app.use("/api", rateLimiter({ windowMs: 60_000, max: 120 }));

  app.use("/api/appointments", appointments);

  app.use(errorHandler);
  return app;
};
