import mongoose from 'mongoose';

// Messages Collection
const MessagesSchema = new mongoose.Schema({
        chatId: String,
        value: String,
        senderId: String,
        date: { type: Date, default: Date.now }
    },
    { timestamps: true }
);
export const messages = mongoose.model('messages', MessagesSchema);