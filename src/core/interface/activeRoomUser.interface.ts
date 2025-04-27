import { Document } from "mongoose";

export interface IActiveRoomUser extends Document {
    roomId: string;
    usersId: string[];
    userName: string;
    status: "active"| "inactive"| "scheduled";
    active: boolean;
}
