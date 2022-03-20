import { Request, Response } from "express";
import { validateFields } from "../utils/validateHasProperty";

import { loginUser } from '../models/login';


export class LoginUserController {
    async handle(req: Request, res: Response){
        const responseValidate = validateFields(req.body, 'email', 'ip');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });
        
        const loginResponse = await loginUser(req.body);

        return res.json(loginResponse);
    }
}

