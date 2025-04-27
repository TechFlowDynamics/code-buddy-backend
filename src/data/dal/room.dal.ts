import { IRoom, RoomType } from "../../core/interface/room.interface";
import RoomModel, { IRoomDocument } from "../models/room.model"; // Assuming IRoomDocument is defined in the model

// Find a room by room code
export const findRoomByCodeDAL = async (
  roomCode: string,
): Promise<IRoomDocument | null> => {
  return await RoomModel.findOne({ roomCode });
};

// Create a new room
export const createRoomDAL = async (
  roomData: IRoom,
): Promise<IRoomDocument> => {
  const newRoom = new RoomModel(roomData);
  return await newRoom.save();
};

// Update a room's users
export const updateRoomUsersDAL = async (
  room: IRoomDocument,
): Promise<IRoomDocument> => {
  return await room.save();
};

// Fetch public rooms with pagination

export const fetchRoomsDAL = async (skip: number, limit: number, currentTime: Date) => {
  return RoomModel.find({
    endTime: { $gt: currentTime }, // Fetch only rooms that have not ended
  })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
};



// Count total public rooms

export const countRoomsDAL = async (currentTime: Date) => {
  return RoomModel.countDocuments({
    endTime: { $gt: currentTime }, // Count only active rooms
  });
};

export const exitRoomDal = async (
  roomId: string,
): Promise<IRoomDocument | null> => {
  return await RoomModel.findByIdAndDelete(roomId);
};
