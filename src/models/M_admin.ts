import { chats } from '../services/chats';
import { rooms } from '../services/rooms';

// --------------------------------------------CREATE ---------------------------------------

// Inserir Chat em uma igreja
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

// inserir Usuário em um Chat
interface userArray{
    users: String
}
export async function insertUserChatAdmin(_id: String, users: userArray[]){
    try {
        console.log(users)
        const userChatExists = await chats.find({
            "_id" : _id, 
            "users": {$elemMatch: {idUser: users.idUser}} 
        })
        console.log(userChatExists)
        if(!userChatExists){
            console.log('Passou')
            const insertUserChat = await chats.updateOne(
                {'_id': _id},
                {$push : {
                    "users": users
                }
            })
            return insertUserChat;
        }
        return {
            'code' : 2,
            'msg' : 'Usuário já presente no grupo!'
        }

    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}

// --------------------------------------------READ ---------------------------------------

// Encontrar todos Chats da igreja
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

// Encontrar os usuários de determinada igreja
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

// Encontrar os usuários de determinado chat
export async function findUsersChat(roomId: String, _id: String){
    try {
        const allUsersChat = await chats.find({
            '_id': _id,
            'roomId': roomId
        }).select('-_id -roomId -name');

        return allUsersChat;
    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}

// --------------------------------------------UPDATE ---------------------------------------
// Atualizar nome do chat
export async function updateChatName(_id: String, name: String){
    try {
        const chatUpdated = await chats.updateOne(
            {'_id': _id},
            {$set: {
                'name': name
            }}
        );
        console.log(chatUpdated)
        if (chatUpdated.modifiedCount===1){
            return {
                'code' : 1,
                'msg'  : 'Nome do grupo atualizado com sucesso!'
            }
        } else {
            return {
                'code' : 2,
                'msg' : 'Houve um erro ao atualizar o nome do grupo!'
            }
        }
    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}

// --------------------------------------------DELETE ---------------------------------------
// Deletar Chat de determinada igreja
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

// Deletar Usuário de determinado Chat
export async function deleteUserChat(_id: String, idUser: String){
    try {
        const UserChatDeleted = await chats.updateOne(
            {'_id': _id},
            {$pull: {users: {'idUser': idUser}}}
        )

        if (UserChatDeleted.modifiedCount===1){
            return {
                'code' : 1,
                'msg'  : 'Usuário removido com sucesso!'
            }
        } else {
            return {
                'code' : 2,
                'msg' : 'Houve um erro ao remover o usuário!'
            }
        }

    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}