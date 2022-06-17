import { rooms } from '../services/rooms' 
import { chats } from '../services/chats';
import { messages } from '../services/messages'

import { Message } from '../types/webSocketTypes'

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

export async function getAllMenssages(chatId: string){
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

export async function insertMessage(message: Message){
    try {
        const insertMessage = await messages.insertMany(message)

        if (insertMessage){
            return {
                "code": 1,
                "message": insertMessage[0]
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
export async function deleteMessage(_id: String, chatId: String){
    try {
        const messageDeleted = await messages.updateOne(
            {'_id': _id},
            {$set: {
                'value': 'Mensagem apagada...',
                'status': 'deleteMensagem'
            }}
        )
        const allMenssages = await messages.find({ chatId })

        return allMenssages
    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}