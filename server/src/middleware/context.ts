import type { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";

import { jwtSecret } from "../config/index.js";
import type { ContextInterface } from "../interfaces/contextHandlerInterface.js";

export const contextHandler = async ({
  req,
  res,
  next,
}: {
  req: Request;
  res?: Response;
  next?: NextFunction;
}): Promise<ContextInterface | void> => {
  const bearerToken = req.headers.authorization
    ? req.headers.authorization
    : undefined;

  const authorization = bearerToken ? bearerToken.split(" ")[1] : undefined;
  if (!bearerToken || !authorization) {
    if (next) {
      res?.status(401).json({ message: "Unauthorized User" });
      return; // return void for rest api if no token is provided
    }
    return { id: undefined, role: undefined };
  }
  const decodedUser = jwt.verify(authorization, jwtSecret);
  if (typeof decodedUser === "string" || !decodedUser) {
    //error
    if (next) {
      res?.status(401).json({ message: "Unauthorized User" });
      return;
    }
    throw new Error("invalid token from user");
  }
  if (next) {
    req.user = { id: decodedUser.id, role: decodedUser.role };
    next();
  }
  return { id: decodedUser.id, role: decodedUser.role };
};
