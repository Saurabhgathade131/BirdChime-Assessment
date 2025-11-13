import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/appointments",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173"
};
