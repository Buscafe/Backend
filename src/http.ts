import express from 'express'
import { router } from './routes';
import { Server } from "socket.io";
import http from 'http'

const app  = express();

const serverHttp = http.createServer(app)
const io = new Server(serverHttp, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-type');
    next();
});

app.use(express.json());
app.use(router);

export { serverHttp, io }