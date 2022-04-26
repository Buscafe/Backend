import { validateFields } from "../utils/validateHasProperty";
import { Request, Response } from "express";

import { findRooms, findChats } from '../models/M_chat'


export class ChatController {
    async getRooms(req: Request, res: Response){
        const responseValidate = validateFields(req.params, 'id_user', 'roomId');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });
        
        const getRoomsResponse = await findChats(Number(req.params.id_user), req.params.roomId);

        return res.json(getRoomsResponse);
    }

    async getChurches(req: Request, res: Response){
        const responseValidate = validateFields(req.params, 'id_user');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });
        
        const getRoomsResponse = await findRooms(Number(req.params.id_user));

        return res.json(getRoomsResponse);
    }
}