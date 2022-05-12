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
    socket.on('messageTyping', (data) => {
        socket.broadcast.emit(
            'newMessageTyping', data
        )
    })
    socket.on('addChat', (data) => {
        // Pesquisar sobre filtro no socket.broadcast
        // socket.join(data.roomId)
        // socket.in(data.roomId).emit(
        //     'deletedChat', data
        // )
        socket.broadcast.emit(
            'newChat', data
        )
    })
    // const rooms = [];
    socket.on('deleteChat', (data) => {
        // Pesquisar sobre filtro no socket.broadcast
        // é preciso realizar o filtro pelo id do socket
        // Talvez se faz necessário armazenar o socket de todas as salas(igrejas)
        
        // function getCurrentChurch(id: String) {
        //     return rooms.find(room => room.id === id);
        //   }
        // const user = getCurrentChurch(socket.id);
        // io.to(user.room).emit('deletedChat', data);
        
        socket.broadcast.emit(
            'deletedChat', data
        )
    })
}); 