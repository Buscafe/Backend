import { io } from './http';
import { getAllMenssages, insertMessage} from './models/M_chat'

import { 
    AddChatProps, 
    Message, 
    MessageTypingProps, 
    DeleteUserProps,
    KickedOutProps,
    DeleteChatProps
} from './types/webSocketTypes'

io.on("connection", socket  => {   
    console.log(`Socket connected ! session id: ${socket.id}`)

    // Take all messages in a chat
    socket.on('getMensages', async (chatId: string, callback) => {
        socket.join(chatId);
        callback(await getAllMenssages(chatId))
    })
    // Send new message
    socket.on('sendMessage', async (message: Message, callback) => {
        const messageResponse = await insertMessage(message)  
        socket.to(message.chatId).emit('newMessage', messageResponse)
        callback(messageResponse)
    })
    // When a user delete a message
    socket.on('updateMessages', (data: Message) =>{
        socket.to(data.chatId).emit('updatedMessages', data)
    })
    // Identify who is typing a message
    socket.on('messageTyping', (data: MessageTypingProps) => {
        socket.to(data.chatId).emit('newMessageTyping', data)
    })
    // User leave the group
    socket.on('deleteUser', (data: DeleteUserProps) => {      
        socket.to(data.chatId).emit('deletedUser', data)
    })
    // User kicked out the group
    socket.on('kickedOut', (data: KickedOutProps) => {
        socket.to(data.chatId).emit('userKickedOut', data)
    })

    // Add group
    socket.on('addChat', (data: AddChatProps) => {
        socket.to(data.chatId).emit('newChat', data)
    })
    // When admin user update chat info
    socket.on('updateChat', (data: {chatId: string, roomId: string}) => {
        socket.to(data.chatId).emit('updatedChat', data)
    })
    // const rooms = [];
    socket.on('deleteChat', (data: DeleteChatProps) => {      
        socket.to(data.chatId).emit('deletedChat', data)
    })

}); 