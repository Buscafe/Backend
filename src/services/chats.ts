import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
        idUser: String,
        name: String
    },
    { timestamps: true }
);

// Chats Collection
const ChatsSchema = new mongoose.Schema({
        roomId: String,
        name: String,
        description: String,
        users: [{type: UserSchema, required: true}],
        adminUser: {idUser: String, name: String}
    },
    { timestamps: true }
);
export const chats = mongoose.model('chats', ChatsSchema);