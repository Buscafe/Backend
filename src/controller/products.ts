import { Request, Response } from "express";
import { validateFields } from "../utils/validateHasProperty";

import { getAllPlans, createSession, getSession } from "../models/M_products";
import { insertDoc } from "../models/M_doc";
import { changePayment } from "../models/customer";

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

    async getCheckoutSession(req: Request, res: Response){
        const responseValidate = validateFields(req.params, 'checkoutId', 'id_user');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });

        const getSessionResponse = await getSession(req.params.id);

        if(getSessionResponse.session?.status == 'complete'){
            await changePayment(Number(req.params.id_user));
        }

        return res.json(getSessionResponse);
    }
}

