import { io } from './http';
import { getAllMenssages, insertMessage} from './models/M_chat'

io.on("connection", (socket)  => {   
    console.log(`Socket connected ! session id: ${socket.id}`)

    socket.on('getMensages', async (chatId, callback) => {
        callback(await getAllMenssages(chatId))
    })
    socket.on('sendMessage', async (message, callback) => {
        const messageResponse = await insertMessage(message)  
        socket.broadcast.emit(
            'newMessage', messageResponse
        )
        callback(messageResponse)
    })
    socket.on('messageTyping', (data)=>{
        socket.broadcast.emit(
            'newMessageTyping', data
        )
    })
}); 