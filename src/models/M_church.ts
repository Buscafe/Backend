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
                        corpName: true,
                        corpDesc: true
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
                "corpDesc": church.tbl_corp[0].corpDesc,
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

interface joinChurchProps{
    id_user: number,
    id_church: number
}
export async function joinChurch({ id_user, id_church }: joinChurchProps){
    const hadAffiliated = await prisma.tbl_relation.findFirst({
        where: {
            FK_id_user: id_user,
            FK_id_corp: id_church
        }
    })

    if(hadAffiliated){
        return {
            'code': 4,
            'msg' : 'Usuário já afiliado a igreja'
        }
    }

    try {
        const affiliate = await prisma.tbl_relation.create({
            data: {
                FK_id_user: id_user,
                FK_id_corp: id_church,
                relation: 1
            }
        });

        if(affiliate){
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