import { NextFunction, Request, Response } from "express";
import {
  createRoomService,
  exitRoomService,
  getRoomsService,
  joinRoomService,
} from "../service/room.service";
import { responseHandler } from "../../core/handlers/response.handlers";
import { findRoomByCodeDAL } from "../../data/dal/room.dal";
import { ResponseMessages } from "../../core/constants/cloud.constants";

/**
 * Create a new room.
 */
export const createRoom = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      roomName,
      questionIds,
      type,
      startTime,
      endTime,
      roomSize,
      credits,
    } = req.body;

    const userId = req.userData?.userId?.toString();
    if (!userId) {
      res.status(401).json({ message: ResponseMessages.UNAUTHORIZED });
      return;
    }

    // Validate required fields
    if (
      !roomName ||
      !questionIds ||
      !type ||
      !startTime ||
      !endTime ||
      !roomSize ||
      !credits
    ) {
      res
        .status(400)
        .json({ message: ResponseMessages.RES_MSG_BAD_REQUEST_EN });
      return;
    }

    // Call the service
    const createdRoom = await createRoomService({
      roomName,
      questionIds,
      type,
      startTime,
      endTime,
      userId,
      roomSize,
      credits,
    });

    return responseHandler(
      res,
      { room: createdRoom },
      200,
      ResponseMessages.RES_MSG_ROOM_CREATED_EN,
    );
  } catch (error) {
    console.error("Error creating room:", error);
    next(error);
  }
};

/**
 * Join an existing room by room code.
 */
export const joinRoom = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { roomCode } = req.body;
    const userId = req.userData?.userId?.toString();

    if (!roomCode || typeof roomCode !== "string" || roomCode.length !== 6) {
      res
        .status(400)
        .json({ message: ResponseMessages.RES_MSG_INVALID_ROOM_CODE_EN });
      return;
    }

    if (!userId) {
      res.status(401).json({ message: ResponseMessages.UNAUTHORIZED });
      return;
    }

    // Call the service to join the room
    const { room, message } = await joinRoomService(roomCode, userId);

    let responseMessage:
      | typeof ResponseMessages.RES_MSG_NEW_USER_JOINED_EN
      | typeof ResponseMessages.RES_MSG_ROOM_ALREADY_JOINED_EN
      | typeof ResponseMessages.RES_MSG_ROOM_FULL_EN
      | typeof ResponseMessages.RES_MSG_ROOM_NOT_STARTED_EN
      | typeof ResponseMessages.RES_MSG_ROOM_ENDED_EN
      | typeof ResponseMessages.RES_MSG_ROOM_NOT_FOUND_EN;

    responseMessage = ResponseMessages.RES_MSG_NEW_USER_JOINED_EN;
    let statusCode = 200;
    if (message === "already_joined") {
      responseMessage = ResponseMessages.RES_MSG_ROOM_ALREADY_JOINED_EN;
    } else if (message === "room_full") {
      responseMessage = ResponseMessages.RES_MSG_ROOM_FULL_EN;
    } else if (message === "room_not_started") {
      responseMessage = ResponseMessages.RES_MSG_ROOM_NOT_STARTED_EN;
    } else if (message === "room_ended") {
      responseMessage = ResponseMessages.RES_MSG_ROOM_ENDED_EN;
    } else if (message === "room_not_found") {
      responseMessage = ResponseMessages.RES_MSG_ROOM_NOT_FOUND_EN;
    }

    if (message === "room_not_found") {
      statusCode = 404;
    } else if (message === "room_not_started" || message === "room_ended") {
      statusCode = 400;
    } else if (message === "room_full") {
      statusCode = 400;
    }

    return responseHandler(res, { room }, statusCode, responseMessage);
  } catch (error) {
    console.error("Error joining room:", error);
    next(error);
  }
};

/**
 * Get public rooms with pagination.
 */
export const getRooms = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page = "1", limit = "10" } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    if (
      isNaN(pageNumber) ||
      pageNumber <= 0 ||
      isNaN(limitNumber) ||
      limitNumber <= 0
    ) {
      res.status(400).json({
        message: ResponseMessages.RES_MSG_PAGE_OUT_OF_BOUNDS_EN,
      });
      return;
    }

    const roomsData = await getRoomsService(pageNumber, limitNumber);
    return responseHandler(
      res,
      roomsData,
      200,
      ResponseMessages.RES_MSG_ROOMS_FETCHED_EN ||
        "Rooms fetched successfully."
    );
  } catch (error) {
    console.error("Error fetching rooms:", error);
    next(error);
  }
};


/**
 * Verify if a user is in a room.
 */
export const verifyUserInRoom = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { roomCode } = req.params;
    const userId = req.userData?.userId?.toString(); // Extract user ID from token

    if (!userId) {
      return res.status(401).json({ message: ResponseMessages.UNAUTHORIZED });
    }

    // Fetch room details
    const room = await findRoomByCodeDAL(roomCode);
    if (!room) {
      return res
        .status(404)
        .json({ message: ResponseMessages.RES_MSG_ROOM_NOT_FOUND_EN });
    }

    // Check if the user is part of the room
    const isUserInRoom = userId ? room?.users.includes(userId) : false;
    console.log("isUserInRoom", isUserInRoom);
    if (!isUserInRoom) {
      return res
        .status(400)
        .json({ message: "Access Denied: You have not joined this room." });
    }

    return res.status(200).json({ message: "Access Granted", room });
  } catch (error) {
    console.error("Error verifying room access:", error);
    return res
      .status(500)
      .json({ message: ResponseMessages.INTERNAL_SERVER_ERROR });
  }
};

export const exitRoom = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const roomCode  = req.body.roomCode;
    console.log("roomCode", roomCode);
    const userId = req.userData?.userId?.toString();
    if (!roomCode || typeof roomCode !== "string") {
      return res.status(400).json({ message: "Invalid room code" });
    }

    if (!userId) {
      return res.status(405).json({ message: ResponseMessages.UNAUTHORIZED });
    }

    const { room, message } = await exitRoomService(roomCode, userId);
    
    let statusCode = 200;
    if (message === "room_not_found") {
      statusCode = 404;
    } else if (message === "room_deleted") {
      statusCode = 200;
    }

    return responseHandler(res, { room }, statusCode, message);
  } catch (error) {
    console.error("Error exiting room:", error);
    next(error);
  }
};
