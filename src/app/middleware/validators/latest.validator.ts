// src/middleware/validators/user.validator.ts
import { Request, Response, NextFunction } from "express";
import {
  createRoomSchema,
  joinRoomSchema,
  userSchema,
  userStepTwoSchema,
  verifyOTPSchema,
} from "../../../data/validators/schema/userValidation.schema";
import { validateRequest } from "../../../core/utils/validateRequest.utils";
// import { createRoomSchema } from "../../../data/validators/schema/roomValidation.schema";

export const userStepsOne = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const payload = req.body;
  const validatedValue = validateRequest(userSchema, payload);

  if (validatedValue) {
    req.value = validatedValue;
    next();
  }
};

export const verifyOtpValidation = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const payload = req.body;
  const validatedValue = validateRequest(verifyOTPSchema, payload);

  if (validatedValue) {
    req.value = validatedValue;
    next();
  }
};

export const userStepTwo = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const payload = req.body;
  const validatedValue = validateRequest(userStepTwoSchema, payload);

  if (validatedValue) {
    req.value = validatedValue;
    next();
  }
};

export const loginValidate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const payload = req.body;
  const validatedValue = validateRequest(userSchema, payload);

  if (validatedValue) {
    req.value = validatedValue;
    next();
  }
};
export const createRoomValidate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const payload = req.body;

  const validatedValue = validateRequest(createRoomSchema, payload);

  if (validatedValue) {
    req.value = validatedValue;
    next();
  }
};

export const joinRoomValidate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  
  const payload = req.body;
 
  const validatedValue = validateRequest(joinRoomSchema, payload);
 
  if (validatedValue) {
    req.value = validatedValue;
    next();
  }
};