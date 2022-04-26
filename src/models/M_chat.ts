import { rooms } from '../services/rooms' 
import { chats } from '../services/chats';
import { messages } from '../services/messages'

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

export async function getAllMenssages(chatId: number){
    try {
        const allMenssages = await messages.find({ chatId })

        if (!allMenssages.length){
            return {
                'code': 2,
                'msg': 'Chat dont have any messages'
            }
        }

        return allMenssages;
    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}