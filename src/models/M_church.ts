import { PrismaClient } from '@prisma/client';

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
            "estado": string,
            "cidade": string,
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
        const allChurches = await prisma.tbl_user.findMany({
            where: {
                religion,
                type: '2'
            },
            select: {
                tbl_corp: {
                    select: {
                        id_corp: true,
                        coordinate: true,
                        corpName: true,
                        corpDesc: true,
                        roomId: true,
                    },
                },
                localization: true,
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
        
        const formattedChurches: formattedChurchesProps[] = allChurches.map((church) => {
            return {
                "id_corp": church.tbl_corp[0].id_corp,
                "coordinate": {
                    "lat": Number(church.tbl_corp[0].coordinate.split(',')[0].trim()),
                    "lng": Number(church.tbl_corp[0].coordinate.split(',')[1].trim())
                },
                "corpName": church.tbl_corp[0].corpName,
                "corpDesc": church.tbl_corp[0].corpDesc,
                "localization":{
                    "estado": church.localization.split('/')[0].trim(),
                    "cidade": church.localization.split('/')[1].trim()
                },
                "roomId": church.tbl_corp[0].roomId
            }
        });
        const data: formattedRelationsProps = {
            relations: allRelations,
            churches: formattedChurches
        } 

        return data;
    } catch (err) {
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
    const hadAffiliated = await prisma.tbl_relation.findFirst({
        where: {
            FK_id_user: id_user,
            FK_id_corp: id_church
        }
    })
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