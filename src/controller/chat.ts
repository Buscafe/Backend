import { validateFields } from "../utils/validateHasProperty";
import { Request, Response } from "express";

import { findChurches, findRooms } from '../models/M_chat'


export class ChatController {
    async getRooms(req: Request, res: Response){
        const responseValidate = validateFields(req.params, 'id_user', 'church_name');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });
        
        const getRoomsResponse = await findRooms(Number(req.params.id_user), req.params.church_name);

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
        
        const getRoomsResponse = await findChurches(Number(req.params.id_user));

        return res.json(getRoomsResponse);
    }
}