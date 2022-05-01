import { serverHttp } from './http'
import mongoose from 'mongoose';
import './websocket'

const port = process.env.PORT || 3333;

mongoose.connect(process.env.DATABASE_MONGO_URL ?? '', () => console.log('MongoDb has successfully connected !'));

serverHttp.listen(port, () => { console.log(`🚀 Sever is running on port ${port}`) });