import * as dotenv from "dotenv";

//check if the value exists in .env, else exit the process
const checkEnv = <T>(value: T | undefined, name: string): T => {
  if (!value) {
    console.error(`Missing environment variable: ${name}!!`);
    process.exit(1);
  }
  return value;
};
dotenv.config();

const defaultCorsOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5175",
];

export const port = parseInt(checkEnv(process.env.PORT, "PORT")),
  connectionString = checkEnv(
    process.env.CONNECTION_STRING,
    "CONNECTION_STRING",
  ),
  corsWhiteList = Array.from(
    new Set([
      ...defaultCorsOrigins,
      ...checkEnv(process.env.CORS_WHITE_LIST, "CORS_WHITE_LIST")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    ]),
  ),
  jwtSecret = checkEnv(process.env.JWT_SECRET, "JWT_SECRET");

export const khaltiSecretKey = process.env.KHALTI_SECRET_KEY,
  khaltiBaseUrl = process.env.KHALTI_BASE_URL || "https://dev.khalti.com/api/v2",
  frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

export const streamApiKey = process.env.STREAM_API_KEY,
  streamSecret = process.env.STREAM_SECRET;
