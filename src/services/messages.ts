import mongoose from 'mongoose';

// Messages Collection
const MessagesSchema = new mongoose.Schema({
        chatId: String,
        value: String,
        senderId: String,
        sender: String,
    },
    { timestamps: true }
);
export const messages = mongoose.model('messages', MessagesSchema);