import { io } from './http';
import { getAllMenssages, insertMessage} from './models/M_chat'

io.on("connection", (socket)  => {   
    console.log(`Socket connected ! session id: ${socket.id}`)

    // Take all messages in a chat
    socket.on('getMensages', async (chatId, callback) => {
        callback(await getAllMenssages(chatId))
    })
    // Send new message
    socket.on('sendMessage', async (message, callback) => {
        const messageResponse = await insertMessage(message)  
        socket.broadcast.emit('newMessage', messageResponse)
        callback(messageResponse)
    })
    // When a user delete a message
    socket.on('updateMessages', (data) =>{
        socket.broadcast.emit('updatedMessages', data)
    })
    // Identify who is typing a message
    socket.on('messageTyping', (data) => {
        socket.broadcast.emit('newMessageTyping', data)
    })
    // User leave the group
    socket.on('deleteUser', (data) => {      
        socket.broadcast.emit('deletedUser', data)
    })
    // User kicked out the group
    socket.on('kickedOut', (data) => {
        socket.broadcast.emit('userKickedOut', data)
    })
    
    // socket.on('join', chat=>{
    //     socket.join(chat)
    // })

    // Add group
    socket.on('addChat', (data) => {
        socket.broadcast.emit('newChat', data)
    })
    // When admin user update chat info
    socket.on('updateChat', (data) => {
        socket.broadcast.emit('updatedChat', data)
    })
    // const rooms = [];
    socket.on('deleteChat', (data) => {      
        socket.broadcast.emit('deletedChat', data)
    })

}); 