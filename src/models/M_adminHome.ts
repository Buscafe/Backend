import { PrismaClient } from '@prisma/client';
import { rooms } from '../services/rooms';
import { cpf, cnpj } from 'cpf-cnpj-validator'; 

const prisma = new PrismaClient();

// Interfaces
interface churchAdminProps {
    name: string,
    description: string,
    cpf: string,
    cnpj: string,
    users: { idUser: number, name: string }[],
    idUser: number,
    coords: {lat: number, lng: number},
    color: string,
}
interface aboutChurchAdminProps {
    seats: number,
    parking: boolean,
    accessibility: boolean,
    smartphone: string,
    email: string,
    facebook: string,
    roomId: string,
}
interface meetingChurchAdminProps {
    meetingName: string,
    meetingDescription: string,
    meetingDays: [],
    time: string,
    duration: number,
    roomId: string,
}
interface donateChurchAdminProps {
    keyType: 'CPF' | 'CNPJ' | 'email' | 'celular' | 'chave_aleatoria',
    keyValue: string,
    roomId: string,
}

// -------------------------------------------- CREATE ---------------------------------------

// Insert Church
export async function insertChurchAdmin({ name, description, cpf, cnpj, users, idUser, coords, color }: churchAdminProps){
    try {
        // Insert in mongo for we setting rooms and chats
        const insertRooms = await rooms.insertMany({
            'name': name, 
            'users': users
        })
        // Insert first documents for we have a FK_id_doc
        const insertDoc = await prisma.tbl_doc.create({
            data: { cpf, cnpj},
        })

        const id = insertRooms[0]._id.toString().split('"')[0] // Removing Object id notation and saving only the id  
        await prisma.tbl_corp.create({
            data: {
                FK_id_user: idUser,
                FK_id_doc: insertDoc.id_doc,
                corpName: name,
                coordinate: `${coords.lat},${coords.lng}`,
                corpDesc: description,
                roomId: id,
                color,
            },
        });

        const formattedChurch = {
            "name": name,
            "roomId": id
        }

        return {
            'code' : 1,
            'msg' : 'Igreja Cadastrada sucesso!',
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
export async function insertAboutChurchAdmin({ seats, parking, accessibility, smartphone, email, facebook, roomId }: aboutChurchAdminProps){
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
                'msg' : 'Primeiro se deve cadastrar as informações básicas sobre a Igreja',
            } 
        }
        
        // Create info
        await prisma.tbl_info.create({
            data: {
                seats: Number(seats),
                parking,
                accessibility,
                cellphone: smartphone,
                email,
                link: facebook,
                FK_id_corp: church.id_corp                
            },
        });
        return {
            'code' : 1,
            'msg' : 'Informações sobre a Igreja cadastrado sucesso!',
        }

    } catch (error) {
        console.log(error)
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}

// Insert Meeting Church
export async function insertMeetingChurchAdmin({ meetingName, meetingDescription, meetingDays, time, duration, roomId }: meetingChurchAdminProps){
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
                'msg' : 'Primeiro se deve cadastrar as informações básicas sobre a Igreja',
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
            'msg' : 'Informações sobre o culto cadastrada sucesso!',
        }

    } catch (error) {
        console.log(error)
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}

// Insert Donate Church
export async function insertDonateChurchAdmin({ keyType, keyValue, roomId }: donateChurchAdminProps){
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
                'msg' : 'Primeiro se deve cadastrar as informações básicas sobre a Igreja!',
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
            'msg' : 'Chave Pix cadastrada sucesso!',
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
                corpName: true, 
                corpDesc: true, 
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
        console.log(error)
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
                'msg' : 'Nenhuma reunião foi cadastrada. Cadastre uma para visualização de seus fiéis.',
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

// find Donate Church
export async function findDonateChurchAdmin(corpId: number){
    try {
        const donateInfo = await prisma.tbl_donate.findMany({
            where: {
                FK_id_corp: corpId
            }, select: {
                key_type: true, 
                donate_key: true
            },
        })
        if (donateInfo.length === 0){
            return {
                'code' : 2,
                'msg' : 'Nenhuma tipo de oferta foi encontrado. O padrão é presencialmente na instituição.',
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
export async function updateChurchAdmin({ name, description, cpf, cnpj, users, idUser, coords, color }: churchAdminProps){
    
}

// Update About Church
export async function updateAboutChurchAdmin({ seats, parking, accessibility, smartphone, email, facebook }: aboutChurchAdminProps){
    
}

// Update Meeting Church
export async function updateMeetingChurchAdmin({ meetingName, meetingDescription, meetingDays, time, duration }: meetingChurchAdminProps){
    
}

// Update Donate Church
export async function updateDonateChurchAdmin({ keyType, keyValue }: donateChurchAdminProps){
    if(keyType === 'CPF'){
        const validatedKey = cpf.isValid(keyValue);
        return 
    } else if(keyType === 'CNPJ'){
        const validatedKey = cnpj.isValid(keyValue)
        return 
    }  
    return 
}

// -------------------------------------------- DELETE ---------------------------------------

// Delete Meeting Church
interface deleteMeetingChurchAdminProps {

}
export async function deleteMeetingChurchAdmin({  }: deleteMeetingChurchAdminProps){
    
}

// Delete Donate Church
interface deleteDonateChurchAdminProps {

}
export async function deleteDonateChurchAdmin({  }: deleteDonateChurchAdminProps){
    
}