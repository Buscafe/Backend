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


const users: {userId: string, socketId: string}[] = [];

const addUser = (userId: string, socketId: string) => {
    !users.some(user => user.userId === userId) &&
      users.push({ userId, socketId });
};

io.on("connection", socket  => {   
    console.log(`Socket connected ! session id: ${socket.id}`)
    
    socket.on('join', userId  => {
        addUser(userId, socket.id)
    })

    // Take all messages in a chat
    socket.on('getMensages', async (chatId, callback) => {
        callback(await getAllMenssages(chatId))
    })
    // Send new message
    socket.on('sendMessage', async (message: Message, callback) => {
        const messageResponse = await insertMessage(message) 

        users.map(user => {
            console.log(user)
            socket.to(user.socketId).emit('newMessage', messageResponse)
        }) 
        
        callback(messageResponse)
    })
    // When a user delete a message
    socket.on('updateMessages', (data: Message, chatId: string) =>{
        users.map(user => {
            socket.to(user.socketId).emit('updatedMessages', data)
        })
    })
    // Identify who is typing a message
    socket.on('messageTyping', (data: MessageTypingProps) => {
        users.map(user => {
            socket.to(user.socketId).emit('newMessageTyping', data)
        })
    })
    // User leave the group
    socket.on('deleteUser', (data: DeleteUserProps) => {  
        users.map(user => {
            socket.to(user.socketId).emit('deletedUser', data)
        })    
    })
    // User kicked out the group
    // Vamos ter que enviar apenas ao usuario deletado
    socket.on('kickedOut', (data: KickedOutProps) => {
        users.map(user => {
            socket.to(user.socketId).emit('userKickedOut', data)
        })   
    })
    // Add group
    socket.on('addChat', (data: AddChatProps) => {
        socket.emit('newChat', data)
    })
    // When admin user update chat info
    socket.on('updateChat', (data: {chatId: string, roomId: string}) => {
        users.map(user => {
            socket.to(user.socketId).emit('updatedChat', data)
        })
    })
    // Delete a group
    socket.on('deleteChat', (data: DeleteChatProps) => {      
        users.map(user => {
            socket.to(user.socketId).emit('deletedChat', data)
        })  
    })
}); 