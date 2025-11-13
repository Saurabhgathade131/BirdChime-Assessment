import dotenv from "dotenv";
import mongoose from "mongoose";
import { createApp } from "./app";

// Load environment variables from .env
dotenv.config();

// Read environment variables with defaults
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const MONGO_URI = process.env.MONGODB_URI || "";
const NODE_ENV = process.env.NODE_ENV || "development";

// Ensure database URI is provided
if (!MONGO_URI) {
  console.error("❌ MONGODB_URI is not set in environment variables.");
  process.exit(1);
}

// Create Express app
const app = createApp();

/**
 * Connect to MongoDB and start server
 */
async function startServer() {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${NODE_ENV} mode on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", (err as Error).message);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("🔻 Shutting down gracefully...");
  await mongoose.connection.close();
  process.exit(0);
});
