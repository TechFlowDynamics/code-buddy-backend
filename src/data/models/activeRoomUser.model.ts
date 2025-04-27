import { Schema, model } from 'mongoose';
import { IActiveRoomUser } from 'src/core/interface/activeRoomUser.interface';


const ActiveRoomUserSchema: Schema = new Schema({
    roomId: { type: Schema.Types.ObjectId, required: true, ref: 'Room' },
    usersId: { type: [Schema.Types.ObjectId], required: true, ref: 'User' },
    userName: { type: String, required: true },
    status: {
        type: String,
        enum: ["active", "inactive", "scheduled"],
        required: true,
        default: "active",
      },
    active: { type: Boolean, required: true }
});

const ActiveRoomUser = model<IActiveRoomUser>('ActiveRoomUser', ActiveRoomUserSchema);

export default ActiveRoomUser;