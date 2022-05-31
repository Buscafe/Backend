export interface Message {
    chatId: string,
    value: string,
    senderId: string,
    sender: string, 
    status?: 'deleteUser' | 'updateUser' | 'deleteMensagem'
}

export interface MessageTypingProps{
    text_msg: string,
    username: string,
    chatId: string
}
interface User {
    idUser: string,
    name: string,
    _id?: string
}
interface CurrentChat{
    adminUser: User
    createdAt: Date,
    description: string,
    name: string,
    roomId: string,
    updatedAt: Date,
    users: User,
    _id: string
}

export interface DeleteUserProps {
    currentChat: CurrentChat[], 
    users: User[],
    chatId: string
}

export interface KickedOutProps {
    roomId: string, 
    username: string,
    chatId: string
}

export interface AddChatProps {
    chatName: string,
    churchName: string,
    roomId: string,
    chatId: string
}

export interface DeleteChatProps {
    chatName: string,
    churchName: string,
    roomId: string,
    chatId: string
}

export interface UsersOnline {
    userId: string   
   socketId:string 
}