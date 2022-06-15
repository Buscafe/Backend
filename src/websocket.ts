import { io } from './http';
import { getAllMenssages, insertMessage } from './models/M_chat'

import { 
    AddChatProps, 
    Message, 
    MessageTypingProps, 
    DeleteUserProps,
    KickedOutProps,
    DeleteChatProps,
    UsersOnline
} from './types/webSocketTypes'


// save all users online
let users: UsersOnline[] = [];
const addUser = ({userId, socketId}: UsersOnline) => {
    !users.some(user => user.userId === userId) &&
        users.push({ userId, socketId });
};
// check which users are online
const getUser = (receivers: [{idUser: string}]) => {
    const usersOnline: UsersOnline[] = [];
    receivers.forEach(receiver => {
        const member = users.find(user => (user.userId).toString() === receiver.idUser);
        
        if(member !== undefined){
            usersOnline.push(member)
        } 
        return;
    })

    return usersOnline
};

const removeUser = (socketId: string) => {
    users = users.filter((user) => user.socketId !== socketId);
};
       
io.on("connection", socket  => {       
    socket.on('join', userId  => {
        addUser({userId, socketId: socket.id})
    })

    // Add group
    socket.on('addChat', (data: AddChatProps, receivers) => { 

        const members = getUser(receivers);
        members.map(member => {
            socket.to(member.socketId).emit('newChat', data)
        }) 
    })
    // When admin user update chat info
    socket.on('updateChat', (data: {chatId: string, roomId: string}, receivers) => {
        const members = getUser(receivers);
        members.map(member => {
            socket.to(member.socketId).emit('updatedChat', data)
        }) 
    })
    // Delete a group
    socket.on('deleteChat', (data: DeleteChatProps, receivers) => {       
        const members = getUser(receivers);
        members.map(member => {
            socket.to(member.socketId).emit('deletedChat', data)
        }) 
    })
    // Take all messages in a chat
    socket.on('getMensages', async (chatId, callback) => {
        callback(await getAllMenssages(chatId))
    })
    // Send new message
    socket.on('sendMessage', async (message: Message, receivers, callback) => {
        const messageResponse = await insertMessage(message)       
        const members = getUser(receivers);
        members.map(member => {
            socket.to(member.socketId).emit('newMessage', messageResponse)
        }) 
        callback(messageResponse)
    })
    // When a user delete a message
    socket.on('updateMessages', (data: Message, receivers) =>{
        const members = getUser(receivers);
        members.map(member => {
            socket.to(member.socketId).emit('updatedMessages', data)
        })
    })
    // Identify who is typing a message
    socket.on('messageTyping', (data: MessageTypingProps, receivers) => {
        const members = getUser(receivers);
        members.map(member => {
            socket.to(member.socketId).emit('newMessageTyping', data)
        })
    })
    // User leave the group -
    socket.on('deleteUser', (data: DeleteUserProps, receivers) => {  
        const members = getUser(receivers);
        members.map(member => {
            socket.to(member.socketId).emit('deletedUser', data)
        })
    })
    // User kicked out the group
    socket.on('kickedOut', (data: KickedOutProps, deletedUser, receivers) => {
        const deletedMembers = getUser(deletedUser);
        deletedMembers.map(deletedMember => {
            socket.to(deletedMember.socketId).emit('userKickedOut', data)
        })

        const members = getUser(receivers);
        members.map(member => {
            socket.to(member.socketId).emit('kickedOutInformation', data)
        }) 
    })

    // User leave in the site
    socket.on("disconnect", () => {
        console.log("a user disconnected!");
        removeUser(socket.id);
    });
});