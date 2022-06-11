import { Request, Response } from "express";
import { validateFields } from "../utils/validateHasProperty";

import { getAllPlans, createSession } from "../models/M_products";
import { insertDoc } from "../models/M_doc";

export class ProductsController {
    async getAll(req: Request, res: Response){      
        const plansResponse = await getAllPlans();

        return res.json(plansResponse);
    }

    async subscribe(req: Request, res: Response){
        const responseValidate = validateFields(req.body, 'priceId', 'successUrl', 'cancelUrl', 'cpf', 'cnpj');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });

        const insertDocs = await insertDoc(req.body.cpf, req.body.cnpj)
        
        if(insertDocs.err){
            return res.json({err: insertDocs.err, msg: insertDocs.msg});
        }

        const sessionResponse = await createSession(req.body);

        return res.json(sessionResponse);
    }
}

