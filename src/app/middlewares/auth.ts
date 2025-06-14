import { NextFunction, Request, Response } from "express";
import { jwtEncoded } from "../../shared/jwtEncoder";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import APiError from "../errors/ApiError";
import { StatusCodes } from "http-status-codes";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      // console.log("Token:", token);
      if (!token) {
        throw new APiError(StatusCodes.UNAUTHORIZED, "You are not Authorized");
      }
      const verifiedUser = jwtEncoded.verifyToken(
        token,
        config.jwt_secret as Secret
      );

      req.user = verifiedUser;
      // console.log("Verified User:", verifiedUser);
      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new APiError(StatusCodes.UNAUTHORIZED, "You are Unauthorized");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
