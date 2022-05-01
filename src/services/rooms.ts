import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
        idUser: String,
        name: String
    },
    { timestamps: true }
);

// Rooms Collection
const RoomsSchema = new mongoose.Schema({
        name: String,
        users: [{type: UserSchema, required: true}],
    },
    { timestamps: true }
);
export const rooms = mongoose.model('rooms', RoomsSchema);