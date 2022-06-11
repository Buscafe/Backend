import { PrismaClient } from '@prisma/client';
import { chats } from '../services/chats';

const prisma = new PrismaClient();

// Mongo Collections 
import { rooms } from '../services/rooms';


interface formattedChurchesProps{
        id_corp: number,
        coordinate: {
            lat: number,
            lng: number,
        },
        corpName: string,
        corpDesc: string,
        localization: {
            "estado": string | undefined,
            "cidade": string | undefined,
        },
        roomId: string | null,
}
interface formattedRelationsProps{
    relations: {
        FK_id_corp: number | null,
        FK_id_user: number | null,
    }[],
    churches: formattedChurchesProps[]
}

export async function findAllChurches(religion: string, idUser: number){
    try {
        const allChurches = await prisma.tbl_corp.findMany({
            where: {
                tbl_user: {
                    religion: religion,
                }
            },
            select: {
                id_corp: true,
                coordinate: true,
                corpName: true,
                corpDesc: true,
                roomId: true,
                color: true,
                tbl_user : {
                    select: {
                        localization: true,
                    }
                }
            }, 
        });
        const allRelations = await prisma.tbl_relation.findMany({
            where:{
                FK_id_user: idUser
            },
            select: {
                FK_id_corp: true,
                FK_id_user: true,
            } 
        })
        // ARRUMAR
        
        const formattedChurches: formattedChurchesProps[] = allChurches.map((church) => {     
            return {
                "id_corp": church.id_corp,
                "coordinate": {
                    "lat": Number(church.coordinate.split(',')[0].trim()),
                    "lng": Number(church.coordinate.split(',')[1].trim())
                },
                "corpName": church.corpName,
                "corpDesc": church.corpDesc,
                "localization":{
                    "estado": church.tbl_user?.localization.split('/')[0].trim(),
                    "cidade": church.tbl_user?.localization.split('/')[1].trim() 
                },
                "roomId": church.roomId,
                "color": church.color
            }
        });
        const data: formattedRelationsProps = {
            relations: allRelations,
            churches: formattedChurches
        } 

        return data;
    } catch (err) {
        console.log(err)
        return {
            'code': 1,
            'msg' : 'Nenhuma igreja cadastrada na religião determinada',
            'err' : err 
        }
    }
}

interface joinChurchProps{
    id_user: number,
    username: string,
    id_church: number,
    roomId: string,
}
export async function joinChurch({ id_user, username, id_church, roomId}: joinChurchProps){
    try {
        const affiliate = await prisma.tbl_relation.create({
            data: {
                FK_id_user: id_user,
                FK_id_corp: id_church,
                relation: 1
            }
        });
        const affiliateRoom = await rooms.updateOne(
            {"_id": roomId},
            {$push : {
                "users": {
                        "idUser": id_user,
                        "name":  username
                }
            }
        })  
        const joinMainChat = await chats.updateOne(
            {"_id": roomId},
            {$push : {
                "users": {
                        "idUser": id_user,
                        "name":  username
                }
            }
        })       
        if(affiliate && affiliateRoom){
            return {
                'code': 1,
                'msg' : 'Usuário filiado com sucesso' 
            }
        } else {
            return {
                'code': 2,
                'msg' : 'Não foi possível filiar-se à igreja'
            }
        }
    } catch (err) {
        return {
            'code': 3,
            'msg' : 'Houve um erro ao filiar-se à igreja',
            'err' : err 
        }
    }
}