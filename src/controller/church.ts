import { Request, Response } from "express";
import { validateFields } from "../utils/validateHasProperty";

import { findAllChurches, joinChurch } from "../models/M_church";

export class ChurchController {
    async getAll(req: Request, res: Response){
        const responseValidate = validateFields(req.params, 'religion');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });

        const allChurches = await findAllChurches(req.params.religion);
    
        return res.json(allChurches);
    }

    async joinChurch(req: Request, res: Response){
        const responseValidate = validateFields(req.body, 'id_user', 'id_church');

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