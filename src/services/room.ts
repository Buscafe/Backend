import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema({
        idUser: String,
        name: String
    },
    { timestamps: true }
);

const UserChatsSchema = new mongoose.Schema({
        idChats: String,
        name: String
    },
    { timestamps: true }
);

const MessagesChatsSchema = new mongoose.Schema({
        value: String,
        senderId: String,
        date: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

const chatsSchema = new mongoose.Schema({
        idChats: String,
        name: String,
        users: [{type: UserChatsSchema, required: true}],
        messages: [{type: MessagesChatsSchema, required: true}]
    },
    { timestamps: true }
);

const RoomsSchema = new mongoose.Schema({
        RoomsId: String,
        name: String,
        users: [{type: usersSchema, required: true}],
        chats: [{type: chatsSchema, required: true}]
    },
    { timestamps: true }
);

export const rooms = mongoose.model('rooms', RoomsSchema);