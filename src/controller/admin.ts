import { validateFields } from "../utils/validateHasProperty";
import { Request, Response } from "express";

import { insertRoomAdmin, insertChatAdmin, updateChatAdmin,
        findChatsAdmin, findUsersChat, findAllUsers, 
        deleteChat, deleteUserChat
} from "../models/M_admin";

export class AdminController {
// --------------------------------------------CREATE ---------------------------------------
    // Insert Church
    async insertRoom(req: Request, res: Response){
        const responseValidate = validateFields(req.body, 'name', 'description', 'cpf', 'cnpj', 'users', 'idUser', 'coords');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });

        const insertRoomResponse = await insertRoomAdmin(req.body);

        return res.json(insertRoomResponse);
    }
    // Insert Chat in a Church
    async insertChat(req: Request, res: Response){
        const responseValidate = validateFields(req.body, 'roomId', 'description', 'name', 'users', 'adminUser');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });
        
        const insertChatResponse = await insertChatAdmin(req.body);

        return res.json(insertChatResponse);
    }

    // Update Chat
    async updateChat(req: Request, res: Response){
        const responseValidate = validateFields(req.body, 'chatId', 'name', 'description', 'users');
        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });
        
        const insertUserChatResponse = await updateChatAdmin(req.body);

        return res.json(insertUserChatResponse);
    }

// --------------------------------------------READ ---------------------------------------

    // Get all Chats in a church
    async getChats(req: Request, res: Response){
        const responseValidate = validateFields(req.params, 'roomId');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });
        
        const getChatsResponse = await findChatsAdmin(req.params.roomId);

        return res.json(getChatsResponse);
    }

    // Get all users from a Church
    async getAllUsers(req: Request, res: Response){
        const responseValidate = validateFields(req.params, '_id', 'userId');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });
        
        const getAllUsersResponse = await findAllUsers(req.params._id, Number(req.params.userId));

        return res.json(getAllUsersResponse);
    }

    // Get all Users from a Chat
    async getAllUsersChat(req: Request, res: Response){
        const responseValidate = validateFields(req.params, 'roomId', '_id');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });
        
        const getAllUsersChatResponse = await findUsersChat(req.params.roomId, req.params._id);

        return res.json(getAllUsersChatResponse);
    }

    // --------------------------------------------DELETE ---------------------------------------
    // Delete a chat in a church
    async removeChat(req: Request, res: Response){
        const responseValidate = validateFields(req.params, '_id');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });
        
        const removeChatResponse = await deleteChat(req.params._id);

        return res.json(removeChatResponse);
    }

    // Delete a user in a chat
    async removeUserChat(req: Request, res: Response){
        const responseValidate = validateFields(req.params, '_id', 'idUser');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });
        
        const deleteUserChatResponse = await deleteUserChat(req.params._id, req.params.idUser);

        return res.json(deleteUserChatResponse);
    }

}