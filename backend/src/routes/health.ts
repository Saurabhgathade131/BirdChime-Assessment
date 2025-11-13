// backend/src/routes/health.ts
import { Router } from "express";
import mongoose from "mongoose";
const router = Router();
export default {
  liveness: (_: any, res: any) => res.json({ status: "ok" }),
  readiness: async (_: any, res: any) => {
    const ok = mongoose.connection.readyState === 1;
    res.status(ok ? 200 : 500).json({ db: ok ? "up" : "down" });
  }
};
