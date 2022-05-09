import { chats } from '../services/chats';
import { rooms } from '../services/rooms';

// --------------------------------------------CREATE ---------------------------------------

// Insert Chat in a Church
interface insertChatAdminProps {
    roomId: string;
    name: string;
    users: { idUser: number, name: string }[];
}
export async function insertChatAdmin({ roomId, name, users }: insertChatAdminProps){
    try {
        const chatExists = await chats.find({
            "roomId": roomId,
            "name": name
        })
        
        if(chatExists.length === 0){
            const insertChat = await chats.insertMany({
                'roomId': roomId,
                'name': name, 
                'users': users
            })

            return {
                'code' : 1,
                'msg' : 'Grupo criado com sucesso !',
                'room': insertChat[0]
            }
        }

        return {
            'code' : 2,
            'msg' : 'Este nome de grupo já existe! Insira um nome diferente'
        }

    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}

// Update Chat
interface insertUserChatAdminProps {
    chatId: string;
    name: string;
    users: { idUser: number, name: string }[];
}
export async function updateChatAdmin({chatId, name, users}: insertUserChatAdminProps){
    try {
        if (name.trim().length === 0){
            return {
                'code' : 2,
                'msg' : 'O nome do Grupo não pode ser composto apenas por espaços em branco'
            }
        }
        if(name || users){
            const chatUpdated = await chats.updateOne(
                {'_id': chatId},
                {$set: {
                    'name': name
                },$push : {
                    'users': users
                }})
            return {
                'code' : 1,
                'msg' : 'Grupo Atualizado com sucesso',
                'chat': chatUpdated
            }
        }

    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}

// --------------------------------------------READ ---------------------------------------

// Get all Chats in a church
export async function findChatsAdmin(roomId: String){
    try {
        const allChats = await chats.find({
            'roomId': roomId
        });

        return allChats;
    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}

// Get all users from a Church
interface userChurch{
    idUser: number;
    name: string;
}
export async function findAllUsers(_id: String, userId: number){
    try {
        const allUsers = await rooms.find({
            '_id': _id
        }).select('-_id -name');

        let user: userChurch[] = allUsers[0].users
        user = user.filter(user => user.idUser != userId);

        return user;
    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}

// Get all Users from a Chat
export async function findUsersChat(roomId: String, _id: String){
    try {
        const allUsersChat = await chats.find({
            '_id': _id,
            'roomId': roomId
        }).select('users');

        return allUsersChat[0].users;
    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}

// --------------------------------------------DELETE ---------------------------------------
// Delete a chat in a church
export async function deleteChat(_id: String){
    try {
        const chatDeleted = await chats.remove({
            '_id': _id,
        });
        
        if (chatDeleted.deletedCount===1){
            return {
                'code' : 1,
                'msg'  : 'Chat removido com sucesso'
            }
        } else {
            return {
                'code' : 2,
                'msg' : 'Houve um erro ao excluir o Chat'
            }
        }
    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}

// Delete a user in a chat
export async function deleteUserChat(_id: String, idUser: String){
    try {
        const UserChatDeleted = await chats.updateOne(
            {'_id': _id},
            {$pull: {users: {'idUser': idUser}}}
        )
        if (UserChatDeleted.modifiedCount===1){
            return {
                'code' : 1,
                'msg'  : 'Usuário removido com sucesso!',
                'user' : UserChatDeleted
            }
        } 

    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}