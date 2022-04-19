import { io } from './http';

let messages = []

io.on("connection", (socket) => {
    console.log(socket.id)
    
    socket.on('sendMessage', data =>{
        messages.push(data);
        console.log(data);
        socket.broadcast.emit('receivedMessage', data);
    })
});

