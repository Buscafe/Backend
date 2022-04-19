import { serverHttp } from './http'
import './websocket'

const port = process.env.PORT || 3333;

serverHttp.listen(port, () => { console.log(`🚀 Sever is running on port ${port}`) });