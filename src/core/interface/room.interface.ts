export enum RoomType {
  Public = "public",
  Private = "private",
}

export enum RoomStatus {
  Active = "active",
  Inactive = "inactive",
  Scheduled = "scheduled",
}

export interface IRoom {
  roomName: string; // Name of the room
  questionIds: string[]; // IDs of associated questions
  type: RoomType; // Enum for room type (public/private)
  startTime: Date; // Start time of the room
  endTime: Date; // End time of the room
  duration: number; // Duration in minutes
  roomCode?: string; // Optional unique room identifier
  roomHash?: string; // Optional room hash for secure access
  users: string[]; // List of user IDs
  userId: string; // ID of the room creator/owner
  roomSize: number; // Maximum number of users allowed
  credits: string; // Credits required to join the room
  status: RoomStatus; // Enum for room status
  active?: boolean; // Optional derived field; consider computing this dynamically
  createdAt: Date; // Creation timestamp
  expiresAt?: Date; // Optional expiration timestamp
}
