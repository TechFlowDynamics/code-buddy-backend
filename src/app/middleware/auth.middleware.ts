import { Request, Response, NextFunction } from "express";
import { decodeUserToken } from "../../core/utils/util";
import { ResponseMessages } from "../../core/constants/cloud.constants";
import { responseHandler } from "../../core/handlers/response.handlers";
import { UserIncomingDetails } from "../../core/interface/auth.interface";
import {
  CustomError,
  getErrorCode,
  getErrorMessage,
} from "../../core/handlers/error.handlers";
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token: string | undefined = req
      .header("Authorization")
      ?.replace("Bearer ", "");

    if (!token) {
      throw new CustomError(
        "Invalid token ",
        ResponseMessages.RES_MSG_INVALID_TOKEN_EN,
      );
    }

   
    const data: UserIncomingDetails = decodeUserToken(token);
    req.userData = data;
    if (!req.userData) {
      responseHandler(
        res,
        null,
        401,
        ResponseMessages.RES_MSG_INVALID_TOKEN_EN,
      );
    }
    next();
  } catch (error) {
    const code = getErrorCode(error) as number;
    const message = getErrorMessage(error);
 
    return responseHandler(res, null, 402, message);
  }
};

export const isVerifiedUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userData = req.userData;
    if (userData?.emailVerified) {
      next();
    }
    throw new CustomError(
      ResponseMessages.RES_MSG_UNAUTHORIZED_ADMIN_EN,
      "403",
    );
  } catch (error) {
    next(error);
  }
};

export const verifiedToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token: string | undefined = req
      .header("Authorization")
      ?.replace("Bearer", "");
    if (!token) {
      throw new CustomError(
        "Invalid token ",
        ResponseMessages.RES_MSG_INVALID_TOKEN_EN,
      );
    }

    const data: UserIncomingDetails = decodeUserToken(token);
    if (!data) {
      responseHandler(
        res,
        null,
        401,
        ResponseMessages.RES_MSG_INVALID_TOKEN_EN,
      );
    }
    if (data.emailVerified && data.isCompleted) {
      next();
    } else {
      throw new CustomError(
        ResponseMessages.RES_MSG_USER_NOT_VERIFIED_EN,
        "401",
      );
    }
  } catch (error) {
    next(error);
  }
};
