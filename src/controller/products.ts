import { Request, Response } from "express";
import { validateFields } from "../utils/validateHasProperty";

import { getAllPlans, createSession } from "../models/M_products";

export class ProductsController {
    async getAll(req: Request, res: Response){      
        const plansResponse = await getAllPlans();

        return res.json(plansResponse);
    }

    async subscribe(req: Request, res: Response){
        const responseValidate = validateFields(req.body, 'priceId', 'successUrl', 'cancelUrl');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });

        const sessionResponse = await createSession(req.body);

        return res.json(sessionResponse);
    }
}

