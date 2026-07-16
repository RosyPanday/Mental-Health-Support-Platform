import type { Request } from "express";
import jwt from "jsonwebtoken";

import { jwtSecret } from "../config/index.js";
import type { ContextInterface } from "../interfaces/contextHandlerInterface.js";

export const contextHandler = async ({
  req,
}: {
  req: Request;
}): Promise<ContextInterface> => {
  const bearerToken = req.headers.authorization
    ? req.headers.authorization
    : undefined;

  const authorization = bearerToken ? bearerToken.split(" ")[1] : undefined;
  if (!bearerToken || !authorization) {
    return { id: undefined, role: undefined };
  }
  const decodedUser = jwt.verify(authorization, jwtSecret);
  if (typeof decodedUser === "string" || !decodedUser) {
    //error
    throw new Error("invalid token from user");
  }
  return { id: decodedUser.id, role: decodedUser.role };
};
