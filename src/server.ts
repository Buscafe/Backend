import express from 'express'
import { router } from './routes';
import { Server } from "socket.io";

const app  = express();
const port = process.env.PORT || 3333;

const io = new Server(3001)
let messages = []



app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-type');
    next();
});

app.use(express.json());
app.use(router);


app.listen(port, () => { console.log(`🚀 Sever is running on port ${port}`) });

io.on("connection", (socket) => {
    console.log('socket-backend foi conectado')   
    socket.on('sendMessage', data =>{
            messages.push(data);
            console.log(data);
            socket.broadcast.emit('receivedMessage', data);
    })
});


