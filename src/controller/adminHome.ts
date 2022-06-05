import { validateFields } from "../utils/validateHasProperty";
import { Request, Response } from "express";

import { 
    insertChurchAdmin, insertAboutChurchAdmin, insertMeetingChurchAdmin, insertDonateChurchAdmin,
    updateChurchAdmin, updateAboutChurchAdmin, updateMeetingChurchAdmin, updateDonateChurchAdmin,
    deleteMeetingChurchAdmin, deleteDonateChurchAdmin,
    findChurchAdmin, findAboutChurchAdmin, findMeetingChurchAdmin, findDonateChurchAdmin,
} from "../models/M_adminHome"


export class AdminHomeController {
    // -------------------------------------------- CREATE ---------------------------------------

    // Insert Church
    async insertChurch(req: Request, res: Response){
        const responseValidate = validateFields(req.body, 'name', 'description', 'cpf', 'cnpj', 'users', 'idUser', 'coords', 'color');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });

        const insertChurchResponse = await insertChurchAdmin(req.body);

        return res.json(insertChurchResponse);
    }
    // Insert About Church
    async insertAboutChurch(req: Request, res: Response){
        const responseValidate = validateFields(req.body, 'seats', 'parking', 'accessibility', 'smartphone', 'email', 'facebook', 'roomId');
        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });
        const insertAboutChurchResponse = await insertAboutChurchAdmin(req.body);

        return res.json(insertAboutChurchResponse);
    }
    // Insert Meeting Church
    async insertMeetingChurch(req: Request, res: Response){
        const responseValidate = validateFields(req.body, 'meetingName', 'meetingDescription', 'meetingDays', 'time', 'duration');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });

        const insertMeetingChurchResponse = await insertMeetingChurchAdmin(req.body);

        return res.json(insertMeetingChurchResponse);
    }
    // Insert Donate Church
    async insertDonateChurch(req: Request, res: Response){
        const responseValidate = validateFields(req.body, 'keyType', 'keyValue', 'roomId');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });

        const insertDonateChurchResponse = await insertDonateChurchAdmin(req.body);

        return res.json(insertDonateChurchResponse);
    }

    // -------------------------------------------- READ ---------------------------------------

    // Insert Church
    async getChurch(req: Request, res: Response){
        const responseValidate = validateFields(req.params, 'corpId');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });
        
        const getChurchResponse = await findChurchAdmin(Number(req.params.corpId));

        return res.json(getChurchResponse);
    }
    // Insert About Church
    async getAboutChurch(req: Request, res: Response){
        const responseValidate = validateFields(req.params, 'corpId');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });

        const getAboutChurchResponse = await findAboutChurchAdmin(Number(req.params.corpId));

        return res.json(getAboutChurchResponse);
    }
    // Insert Meeting Church
    async getMeetingChurch(req: Request, res: Response){
        const responseValidate = validateFields(req.params);

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });

        const getMeetingChurchResponse = await findMeetingChurchAdmin(req.params);

        return res.json(getMeetingChurchResponse);
    }
    // Insert Donate Church
    async getDonateChurch(req: Request, res: Response){
        const responseValidate = validateFields(req.params, 'corpId');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });

        const getDonateChurchResponse = await findDonateChurchAdmin(Number(req.params.corpId));

        return res.json(getDonateChurchResponse);
    }


    // -------------------------------------------- UPDATE ---------------------------------------
    
    // update Church
    async updateChurch(req: Request, res: Response){
        const responseValidate = validateFields(req.body, 'name', 'description', 'cpf', 'cnpj', 'users', 'idUser', 'coords', 'color');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });

        const updateChurchResponse = await updateChurchAdmin(req.body);

        return res.json(updateChurchResponse);
    }
    // update About Church
    async updateAboutChurch(req: Request, res: Response){
        const responseValidate = validateFields(req.body, 'seats', 'parking', 'accessibility', 'smartphone', 'email', 'facebook');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });

        const updateAboutChurchResponse = await updateAboutChurchAdmin(req.body);

        return res.json(updateAboutChurchResponse);
    }
    // Insert Meeting Church
    async updateMeetingChurch(req: Request, res: Response){
        const responseValidate = validateFields(req.body, 'meetingName', 'meetingDescription', 'meetingDays', 'time', 'duration');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });

        const updateMeetingChurchResponse = await updateMeetingChurchAdmin(req.body);

        return res.json(updateMeetingChurchResponse);
    }
    // Insert Donate Church
    async updateDonateChurch(req: Request, res: Response){
        const responseValidate = validateFields(req.body, 'keyType', 'keyValue');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });

        const updateDonateChurchResponse = await updateDonateChurchAdmin(req.body);

        return res.json(updateDonateChurchResponse);
    }

    // -------------------------------------------- DELETE ---------------------------------------

    // Delete Meeting Church
    async deleteMeetingChurch(req: Request, res: Response){
        const responseValidate = validateFields(req.body, 'meetingName', 'meetingDescription', 'meetingDays', 'time', 'duration');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });

        const deleteMeetingChurchResponse = await deleteMeetingChurchAdmin(req.body);

        return res.json(deleteMeetingChurchResponse);
    }
    // Delete Donate Church
    async deleteDonateChurch(req: Request, res: Response){
        const responseValidate = validateFields(req.body, 'keyType', 'keyValue');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });

        const deleteDonateChurchResponse = await deleteDonateChurchAdmin(req.body);

        return res.json(deleteDonateChurchResponse);
    }
}