import { Request, Response } from "express";
import { validateFields } from "../utils/validateHasProperty";

import { findAllChurches, findAllEvents, joinChurch } from "../models/M_church";

export class ChurchController {
    async getAll(req: Request, res: Response){
        const responseValidate = validateFields(req.params, 'religion', 'idUser');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });

        const allChurches = await findAllChurches(req.params.religion, Number(req.params.idUser));
    
        return res.json(allChurches);
    }
    async getAllEvents(req: Request, res: Response){
        const responseValidate = validateFields(req.params, 'religion', 'idUser');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });

        const allEvents = await findAllEvents(req.params.religion, Number(req.params.idUser));
    
        return res.json(allEvents);
    }

    async joinChurch(req: Request, res: Response){
        const responseValidate = validateFields(req.body, 'id_user', 'username', 'id_church', 'roomId', 'image_url');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });
        const joinChurchResponse = await joinChurch(req.body);
    
        return res.json(joinChurchResponse);
    }
}