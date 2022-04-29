import { rooms } from '../services/rooms' 
import { chats } from '../services/chats';
import { messages } from '../services/messages'

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

export async function findChats(id_user: number, roomId: String){
    try {
        const allChats = await chats.find({
            roomId: roomId,
            users: {
                $elemMatch: { "idUser": id_user }
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

export async function insertMessage(chatId: number, value: String, senderId: String,sender: String){
    try {
        const message = await messages.insertMany({
            "chatId": chatId,
            "value": value,
            "senderId": senderId,
            "sender": sender
        })
        if (message){
            return {
                "code": 1,
                "message": message[0]
            }
        }else{
            return {
                "code": 2
            }
        }
    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}