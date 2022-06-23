import { PrismaClient } from '@prisma/client';
import { rooms } from '../services/rooms';
import { cpf, cnpj } from 'cpf-cnpj-validator'; 
import { chats } from '../services/chats';

const prisma = new PrismaClient();

// -------------------------------------------- CREATE ---------------------------------------

// Insert Church
interface insertChurchAdminProps {
    name: string,
    description: string,
    id_doc: number,
    users: { idUser: number, name: string }[],
    idUser: number,
    username: string,
    coords: {lat: number, lng: number},
    color: string,
    image_url: string | null
}
export async function insertChurchAdmin({ 
    name,
    description,
    id_doc,
    users,
    idUser,
    username,
    coords,
    color,
    image_url 
}: insertChurchAdminProps){
    try {
        // Insert in mongo for we setting rooms and chats
        const insertRooms = await rooms.insertMany({
            'name': name, 
            'users': users
        })

        const id = insertRooms[0]._id.toString().split('"')[0] // Removing Object id notation and saving only the id
        const churchMainChat = await chats.insertMany({
            "roomId": insertRooms[0]._id,
            "name": "Grupo Geral",
            "description": "Grupo Principal da instituição, onde todos os membros se encontrarão!",
            "users": [
                {
                        "idUser" : idUser,
                        "name": username, 
                        "image_url": image_url		
                }
            ],
            "adminUser": {idUser: idUser, name: username}
        })
        
        await prisma.tbl_corp.create({
            data: {
                FK_id_user: idUser,
                FK_id_doc: id_doc,
                corpName: name,
                coordinate: `${coords.lat},${coords.lng}`,
                corpDesc: description,
                roomId: id,
                color,
            },
        });

        const church = await prisma.tbl_corp.findFirst({
            where: { FK_id_user: idUser },
            select: { 
                id_corp: true,
            }
        });

        const formattedChurch = {
            "color": color,
            "id_corp": church?.id_corp,
            "name": name,
            "roomId": id,
        }
        
        return {
            'code' : 1,
            'msg' : 'Instituição cadastrada com sucesso!',
            'room': formattedChurch
        }
    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}

// Insert About Church
interface insertAboutChurchAdminProps {
    seats: number,
    parking: boolean,
    accessibility: boolean,
    cellphone: string,
    email: string,
    facebook: string,
    roomId: string,
}
export async function insertAboutChurchAdmin({ seats, parking, accessibility, cellphone, email, facebook, roomId }: insertAboutChurchAdminProps){
    try {
        // Find church for create info about it
        const church = await prisma.tbl_corp.findUnique({
            where: {
                roomId
            }, select: {
                id_corp: true, 
            },
        })
        if (!church){
            return {
                'code' : 2,
                'msg' : 'Primeiro se deve cadastrar as informações básicas sobre a instituição',
            } 
        }
        
        // Create info
        await prisma.tbl_info.create({
            data: {
                seats: Number(seats),
                parking,
                accessibility,
                cellphone: cellphone,
                email,
                link: facebook,
                FK_id_corp: church.id_corp                
            },
        });
        return {
            'code' : 1,
            'msg' : 'Informações sobre a instituição cadastradas com sucesso!',
        }

    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}

// Insert Meeting Church
interface insertMeetingChurchAdminProps {
    meetingName: string,
    meetingDescription: string,
    meetingDays: [],
    time: string,
    duration: number,
    roomId: string,
}
export async function insertMeetingChurchAdmin({ meetingName, meetingDescription, meetingDays, time, duration, roomId }: insertMeetingChurchAdminProps){
    try {
        // Find church for create info about it
        const church = await prisma.tbl_corp.findUnique({
            where: {
                roomId
            }, select: {
                id_corp: true, 
            },
        })
        if (!church){
            return {
                'code' : 2,
                'msg' : 'Primeiro se deve cadastrar as informações básicas sobre a instituição',
            } 
        }
        
        // formated day
        let days = ''
        if(meetingDays.length > 1){
            meetingDays.map(day => {
                days += `${day}/`
              })
        } else{
            days += `${meetingDays}/`
        }
        let daysFormat = days.slice(0, -1) + ''

        // formated time
        function pad(t: any) {
            return t.toString().padStart(2, 0);
        }
        let d = new Date(time);
        const timeFormat= `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

        // Create meeting info 
        await prisma.tbl_meeting.create({
            data: {
                meeting_name: meetingName,
                meeting_desc: meetingDescription,
                meeting_days: daysFormat,
                meeting_time: timeFormat,
                meeting_duration: Number(duration),
                FK_id_corp: church.id_corp                
            },
        });
        return {
            'code' : 1,
            'msg' : 'Informações sobre o culto cadastradas com sucesso!',
        }

    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}

// Insert Convertion
interface insertConvertionAdminProps {
    title: string,
    event_desc: string,
    event_duration: number,
    event_date: string,
    coords: {lat: number, lng: number},
    FK_id_corp: number
}
export async function insertEventAdmin({ title, event_desc, event_duration, event_date, coords, FK_id_corp }: insertConvertionAdminProps){
    try {
        // formated time
        function pad(t: any) {
            return t.toString().padStart(2, 0);
        }
        let d = new Date(event_date);
        
        const timeFormat= `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

        // Create events
        await prisma.tbl_events.create({
            data: {
                title,
                event_desc,
                event_date: timeFormat,
                event_duration: Number(event_duration),  
                event_coordenate: `${coords.lat},${coords.lng}`,
                FK_id_corp,    
            },
        });
        return {
            'code' : 1,
            'msg' : 'Informações sobre o evento cadastradas com sucesso!',
        }

    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}

// Insert Donate Church
interface insertDonateChurchAdminProps {
    keyType: 'CPF' | 'CNPJ' | 'email' | 'celular' | 'chave_aleatoria',
    keyValue: string,
    roomId: string,
}
export async function insertDonateChurchAdmin({ keyType, keyValue, roomId }: insertDonateChurchAdminProps){
    try {
        let validatedKey = true
        if(keyType === 'CPF'){
            validatedKey = cpf.isValid(keyValue); 
        } else if(keyType === 'CNPJ'){
            validatedKey = cnpj.isValid(keyValue) 
        }    
        if (!validatedKey){
            return {
                'code' : 2,
                'msg' : 'Insira um chave válida!',
            } 
        } 
        // Find church for create info about it
        const church = await prisma.tbl_corp.findUnique({
            where: {
                roomId
            }, select: {
                id_corp: true, 
            },
        })
        if (!church){
            return {
                'code' : 2,
                'msg' : 'Primeiro se deve cadastrar as informações básicas sobre a instituição!',
            } 
        }
        
        // Create Donate
        await prisma.tbl_donate.create({
            data: {
                key_type: keyType,
                donate_key: keyValue,
                FK_id_corp: church.id_corp
            },
        });
        return {
            'code' : 1,
            'msg' : 'Chave Pix cadastrada com sucesso!',
        }

    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}

// -------------------------------------------- READ ---------------------------------------

// find About Church
export async function findChurchAdmin(corpId: number){
    try {
        const church = await prisma.tbl_corp.findUnique({
            where: {
                id_corp: corpId
            }, select: {
                id_corp: true, 
                FK_id_doc: true,
                corpName: true, 
                corpDesc: true, 
                coordinate: true, 
                color: true,
                tbl_doc: {
                    select: {
                        id_doc: true
                    }
                },
                tbl_user: {
                    select:{
                        localization: true
                    }
                }
            },
        })
        if (!church){
            return {
                'code' : 2,
                'msg' : 'Nenhuma informação básica da instituição foi cadastrada.',
            } 
        }
        return {
            'code' : 1,
            'msg' : church,
        } 
    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}
// find About Church
export async function findAboutChurchAdmin(corpId: number){
    try {
        const aboutInfo = await prisma.tbl_info.findUnique({
            where: {
                FK_id_corp: corpId
            }, select: {
                id_info: true,
                cellphone: true,
                email: true, 
                link: true, 
                seats: true, 
                parking: true, 
                accessibility: true, 
            },
        })
        if (!aboutInfo){
            return {
                'code' : 2,
                'msg' : 'Nenhuma informação sobre a instituição foi cadastrada.',
            } 
        }
        return {
            'code' : 1,
            'msg' : aboutInfo,
        } 
    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}

// find Meeting Church
export async function findMeetingChurchAdmin(corpId: number){
    try {
        const meetingInfo = await prisma.tbl_meeting.findMany({
            where: {
                FK_id_corp: corpId
            }, select: {
                id_meeting: true,
                meeting_name: true,
                meeting_desc: true,
                meeting_time: true,
                meeting_duration: true, 
                meeting_days: true
            },
        })
        if (meetingInfo.length === 0){
            return {
                'code' : 2,
                'msg' : 'Nenhuma reunião foi cadastrada.',
            } 
        }

        return {
            'code' : 1,
            'msg' : meetingInfo,
        } 
    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}

// find Meeting Church
export async function findEventsChurchAdmin(corpId: number){
    try {
        const eventsInfo = await prisma.tbl_events.findMany({
            where: {
                FK_id_corp: corpId
            }, select: {
                id_event: true,
                title: true,
                event_desc: true,
                event_date: true,
                event_duration: true, 
                event_coordenate: true,
            },
        })
        if (eventsInfo.length === 0){
            return {
                'code' : 2,
                'msg' : 'Nenhum evento foi cadastrado.',
            } 
        }

        return {
            'code' : 1,
            'msg' : eventsInfo,
        } 
    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}

// find Donate Church
export async function findDonateChurchAdmin(corpId: number){
    try {
        const donateInfo = await prisma.tbl_donate.findMany({
            where: {
                FK_id_corp: corpId
            }, select: {
                id_donate: true,
                key_type: true, 
                donate_key: true
            },
        })
        if (donateInfo.length === 0){
            return {
                'code' : 2,
                'msg' : 'Nenhuma tipo de oferta foi encontrado.',
            } 
        }
        return {
            'code' : 1,
            'msg' : donateInfo,
        } 
    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}


// -------------------------------------------- UPDATE ---------------------------------------

// Update Church
interface updateChurchAdminProps {
    roomId: string,
    id_doc: number,
    id_corp: number,
    name: string,
    description: string,
    cpf: string,
    cnpj: string,
    coords: {lat: number, lng: number},
    color: string,
    
}
export async function updateChurchAdmin({ roomId, id_doc, id_corp, name, description, coords, color }: updateChurchAdminProps){
    try{
        // Insert in mongo for we setting rooms and chats
        const updateRooms = await rooms.updateOne(                
            {'_id': roomId},
            {$set: {
                'name': name,
            }})

        await prisma.tbl_corp.update({
            where: {
                id_corp, 
            },
            data: {
                corpName: name,
                coordinate: `${coords.lat},${coords.lng}`,
                corpDesc: description,
                color,
            },
        });
        const formattedChurch = {
            "color": color,
            "id_corp": id_corp,
            "name": name,
            "roomId": roomId,
        }

        return {
            'code' : 1,
            'msg' : 'Instituição atualizada com sucesso!',
            'room': formattedChurch
        }
    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}
// Update About Church
interface updateAboutChurchAdminProps {
    id_info: number,
    seats: number,
    parking: boolean,
    accessibility: boolean,
    cellphone: string,
    email: string,
    facebook: string,
}
export async function updateAboutChurchAdmin({ id_info, seats, parking, accessibility, cellphone, email, facebook }: updateAboutChurchAdminProps){
    try {
         // Create info
        await prisma.tbl_info.update({
            where: {
                id_info
            },
            data: {
                seats: Number(seats),
                parking,
                accessibility,
                cellphone,
                email,
                link: facebook,               
            },
        });
        return {
            'code' : 1,
            'msg' : 'Informações sobre a instituição atualizadas com sucesso!',
        }

    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}

// Update Meeting Church
interface updateMeetingChurchAdminProps {
    id_meeting: number,
    meetingName: string,
    meetingDescription: string,
    meetingDays: [],
    time: string,
    duration: number,
}

// -------------------------------------------- DELETE ---------------------------------------

// Delete Meeting Church
export async function deleteMeetingChurchAdmin(id_meeting: number){
    try {
        const meetingDeleted = await prisma.tbl_meeting.delete({
            where: {
                id_meeting
            }
        });

        return {
            'code' : 1,
            'msg'  : 'Reunião removida com sucesso!'
        }
    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}

// Delete Donate Church
export async function deleteEventChurchAdmin(id_event: number){
    try {
        const eventDeleted = await prisma.tbl_events.delete({
            where: {
                id_event
            }
        });

        return {
            'code' : 1,
            'msg'  : 'Evento removido com sucesso'
        }
    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}

// Delete Donate Church
export async function deleteDonateChurchAdmin(id_donate: number){
    try {
        const donateDeleted = await prisma.tbl_donate.delete({
            where: {
                id_donate
            }
        });
        
        return {
            'code' : 1,
            'msg'  : 'Modo de doação removido com sucesso'
        }
    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}