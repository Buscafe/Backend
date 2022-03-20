import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function findAllChurches(religion: string){
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
                        corpName: true
                    }
                },
                localization: true
            }
        });


        const formattedChurches = allChurches.map((church) => {
            return {
                "id_corp": church.tbl_corp[0].id_corp,
                "coordinate": {
                    "lat": Number(church.tbl_corp[0].coordinate.split(',')[0].trim()),
                    "lng": Number(church.tbl_corp[0].coordinate.split(',')[1].trim())
                },
                "corpName": church.tbl_corp[0].corpName,
                "localization":{
                    "estado": church.localization.split('/')[0].trim(),
                    "cidade": church.localization.split('/')[1].trim()
                }
            }
        });

        return formattedChurches;
    } catch (err) {
        return {
            'code': 1,
            'msg' : 'Nenhuma igreja cadastrada na religião determinada',
            'err' : err 
        }
    }
}