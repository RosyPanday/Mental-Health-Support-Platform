import * as dotenv from "dotenv";

//check if the value exists in .env, else exit the process
const checkEnv = <T>(value: T | undefined, name: string): T => {
  if (!value) {
    console.error("Missing environment variable: ${name}!!");
    process.exit(1);
  }
  return value;
};
dotenv.config();

export const port = parseInt(checkEnv(process.env.PORT, "PORT")),
  connectionString = checkEnv(
    process.env.CONNECTION_STRING,
    "CONNECTION_STRING",
  ),
  corsWhiteList = checkEnv(
    process.env.CORS_WHITE_LIST,
    "CORS_WHITE_LIST",
  ).split(","),
  jwtSecret = checkEnv(process.env.JWT_SECRET, "JWT_SECRET");
