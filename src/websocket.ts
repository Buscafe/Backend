import { io } from './http';
import { getAllMenssages } from './models/M_chat'

io.on("connection", (socket)  => {   
    console.log(`Socket connected ! session id: ${socket.id}`)

    socket.on('getMenssages', async (chatId, callback) => {
        callback(await getAllMenssages(chatId))
    })
}); 