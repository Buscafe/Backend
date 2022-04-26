import { rooms } from '../services/rooms' 
import { chats } from '../services/chats';

export async function findChats(id_user: number, RoomId: String){
    try {
        const allChats = await chats.find({
            RoomId: RoomId,
            users: {
                $elemMatch: { id_user }
            }
        });
        return allChats;
    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}
export async function findRooms(id_user: number){
    try {
        const allRooms = await rooms.find({
            users: {
                $elemMatch: { idUser: id_user }
            }   
        });
        if (!allRooms.length){
            return {
                'code': 2,
                'msg': 'User dont have any chunch affiliate'
            }
        }
        return allRooms;
    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}