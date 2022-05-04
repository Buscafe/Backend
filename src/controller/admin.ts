import { validateFields } from "../utils/validateHasProperty";
import { Request, Response } from "express";

import { insertChatAdmin, insertUserChatAdmin,
        findChatsAdmin, findUsersChat, findAllUsers, 
        updateChatName,
        deleteChat, deleteUserChat
} from "../models/M_admin";

export class AdminController {
// --------------------------------------------CREATE ---------------------------------------
    // Inserir Chat em uma igreja
    async insertChat(req: Request, res: Response){
        const responseValidate = validateFields(req.body, 'roomId', 'name', 'users');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });
        
        const insertChatResponse = await insertChatAdmin(req.body.roomId, req.body.name, req.body.users);

        return res.json(insertChatResponse);
    }

    // inserir Usuário em um Chat
    async insertUserChat(req: Request, res: Response){
        const responseValidate = validateFields(req.body, '_id', 'users');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });
        
        const insertUserChatResponse = await insertUserChatAdmin(req.body._id, req.body.users);

        return res.json(insertUserChatResponse);
    }

// --------------------------------------------READ ---------------------------------------

    // Encontrar todos Chats da igreja
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

    // Encontrar os usuários de determinada igreja
    async getAllUsers(req: Request, res: Response){
        const responseValidate = validateFields(req.params, '_id');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });
        
        const getAllUsersResponse = await findAllUsers(req.params._id);

        return res.json(getAllUsersResponse);
    }

    // Encontrar os usuários de determinado chat
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

// --------------------------------------------UPDATE ---------------------------------------
    // Atualizar nome do chat
    async updateChat(req: Request, res: Response){
        const responseValidate = validateFields(req.body, '_id', 'name');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });
        
        const updateChatResponse = await updateChatName(req.body._id, req.body.name);

        return res.json(updateChatResponse);
    }

    // --------------------------------------------DELETE ---------------------------------------
    // Deletar Chat de determinada igreja
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

    // Deletar Usuário de determinado Chat
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