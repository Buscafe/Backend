import { Request, Response } from "express";
import { validateFields } from "../utils/validateHasProperty";

import { insertUser, updateUser, updateCoordinate, removeIp, changePayment } from "../models/customer";

export class UserController {
    async insert(req: Request, res: Response){
        const responseValidate = validateFields(req.body, 'email', 'pass', 'religion', 'ip', 'name', 'user_type');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });

        const insertUserResponse = await insertUser(req.body);
    
        return res.json(insertUserResponse);
    }
    
    async update(req: Request, res: Response){
        const responseValidate = validateFields(req.body, 'email', 'ip');
        
        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });

        const updateUserResponse = await updateUser(req.body);
    
        return res.json(updateUserResponse);
    }

    async updateCoords(req: Request, res: Response){
        const responseValidate = validateFields(req.body, 'id_user', 'coordinate');
        
        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });

        const updateCoordsResponse = await updateCoordinate(req.body);
    
        return res.json(updateCoordsResponse);
    } 

    async removeDevice(req: Request, res: Response){
        const responseValidate = validateFields(req.query, 'id');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });

        if(req.query.id){
            const removeDeviceResponse = await removeIp(Number(req.query.id));
    
            return res.json(removeDeviceResponse);
        }
    }

    async updatePayment(req: Request, res: Response){
        const responseValidate = validateFields(req.params, 'id_user');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });

        const removeDeviceResponse = await changePayment(Number(req.params.id_user));

        return res.json(removeDeviceResponse);
    }
}