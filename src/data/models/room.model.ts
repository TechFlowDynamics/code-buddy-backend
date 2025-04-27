import mongoose, { Document } from "mongoose";
import { IRoom, RoomStatus, RoomType } from "../../core/interface/room.interface";

export interface IRoomDocument extends IRoom, Document {}

const RoomSchema = new mongoose.Schema<IRoomDocument>({
  roomName: { type: String, required: true },
  questionIds: { type: [String], required: true },
  type: { type: String, enum: Object.values(RoomType), required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  duration: { type: Number, required: true },
  roomCode: { type: String, unique: true },
  roomHash: { type: String },
  users: { type: [String], default: [] },
  userId: { type: String, required: true },
  roomSize: { type: Number, required: true },
  credits: { type: String, required: true },
  status: { type: String, enum: Object.values(RoomStatus), required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
});

const RoomModel = mongoose.model<IRoomDocument>("Room", RoomSchema);
export default RoomModel;
