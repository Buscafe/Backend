import { validateFields } from "../utils/validateHasProperty";
import { Request, Response } from "express";

import { 
    insertChurchAdmin, insertAboutChurchAdmin, insertMeetingChurchAdmin, insertEventAdmin, insertDonateChurchAdmin,
    findChurchAdmin, findAboutChurchAdmin, findMeetingChurchAdmin, findEventsChurchAdmin, findDonateChurchAdmin,
    updateChurchAdmin, updateAboutChurchAdmin,
    deleteMeetingChurchAdmin, deleteEventChurchAdmin, deleteDonateChurchAdmin,
} from "../models/M_adminHome"


export class AdminHomeController {
    // -------------------------------------------- CREATE ---------------------------------------

    // Insert Church
    async insertChurch(req: Request, res: Response){
        const responseValidate = validateFields(req.body, 'name', 'description', 'cpf', 'cnpj', 'users', 'idUser', 'username', 'coords', 'color');

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
        const responseValidate = validateFields(req.body, 'seats', 'parking', 'accessibility', 'cellphone', 'email', 'facebook', 'roomId');
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
        const responseValidate = validateFields(req.body, 'meetingName', 'meetingDescription', 'meetingDays', 'time', 'duration', 'roomId');

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
    // Insert Event
    async insertEvent(req: Request, res: Response){
        const responseValidate = validateFields(req.body, 'title', 'event_desc', 'event_duration', 'event_date', 'coords', 'FK_id_corp');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });

        const insertEventResponse = await insertEventAdmin(req.body);

        return res.json(insertEventResponse);
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

    // Find Church
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
    // Find About Church
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
    // Find Meeting Church
    async getMeetingChurch(req: Request, res: Response){
        const responseValidate = validateFields(req.params, 'corpId');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });

        const getMeetingChurchResponse = await findMeetingChurchAdmin(Number(req.params.corpId));

        return res.json(getMeetingChurchResponse);
    }
    // Find Events Church
    async getEventsChurch(req: Request, res: Response){
        const responseValidate = validateFields(req.params, 'corpId');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });

        const getEventsChurchResponse = await findEventsChurchAdmin(Number(req.params.corpId));

        return res.json(getEventsChurchResponse);
    }
    // Find Donate Church
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
        const responseValidate = validateFields(req.body, 'roomId', 'id_doc', 'id_corp', 'name', 'description', 'cpf', 'cnpj', 'coords', 'color');

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
        const responseValidate = validateFields(req.body, 'id_info', 'seats', 'parking', 'accessibility', 'cellphone', 'email', 'facebook');

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
   
    // -------------------------------------------- DELETE ---------------------------------------

    // Delete Meeting Church
    async deleteMeetingChurch(req: Request, res: Response){
        const responseValidate = validateFields(req.params, 'id_meeting');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });

        const deleteMeetingChurchResponse = await deleteMeetingChurchAdmin(Number(req.params.id_meeting));

        return res.json(deleteMeetingChurchResponse);
    }
    // Delete Donate Church
    async deleteEventChurch(req: Request, res: Response){
        const responseValidate = validateFields(req.params, 'id_event');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });

        const deleteEventChurchResponse = await deleteEventChurchAdmin(Number(req.params.id_event));
        return res.json(deleteEventChurchResponse);
    }
    
    // Delete Donate Church
    async deleteDonateChurch(req: Request, res: Response){
        const responseValidate = validateFields(req.params, 'id_donate');

        responseValidate.map(validate => {
            if(!validate.exists){
                return res.json({'Error': `Missing parameter ${validate.field}`});
            } else if (validate.empty){
                return res.json({'Error': `Parameter ${validate.field} are empty`});
            } 
        });

        const deleteDonateChurchResponse = await deleteDonateChurchAdmin(Number(req.params.id_donate));
        return res.json(deleteDonateChurchResponse);
    }
}