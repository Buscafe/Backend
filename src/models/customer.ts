import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import md5 from 'md5'

const prisma = new PrismaClient();


interface InsertUserProps{
    email: string;
    pass: string;
    religion: string;
    ip: string;
    name: string;
    user_type: string;
}
export async function insertUser({
    email, 
    pass, 
    religion,
    ip,
    name,
    user_type
}: InsertUserProps){
    const userExists = await prisma.tbl_user.findUnique({
        where: {
            email: email
        }
    });

    if(!userExists){
        const firstName = name.split(' ')[0];

        const { data } = await axios.get(`http://ip-api.com/json/${ip}`);
        const location = `${data.regionName}/${data.city}`

        const { id_user } = await prisma.tbl_user.create({
            data: { 
                user: firstName,
                name: name,
                religion: religion,
                email: email,
                password: md5(pass),
                localization: location,
                type: `${user_type}`,
                estatus: 1,
            },
            select: {
                id_user: true
            }
        });

        const insertIp = await prisma.tbl_devices.create({
            data: {
                ip,
                FK_id_user: id_user,
                status: 1
            }
        })

        if(id_user && insertIp){
            return {
                'code': 1,
                'msg': 'Usuário Cadastrado Corretamente'
            }
        } else {
            return {
                'code' : 5,
                'msg' : 'Houve um problema na inserção do usuário'
            }
        }
    } else {
        return{
            'code': 6,
            'msg': 'Usuário existente'
        }
    }
}


interface updateUserProps{
    email: string;
    pass: string;
    ip: string
}
export async function updateUser({email, pass, ip}: updateUserProps){
    if(pass !== ''){
        //UPDATE PASS
        const user = await prisma.tbl_user.findUnique({
            where: {
                email: email
            },
            select: {
                id_user: true
            }
        });

        if(user){
            const hasDevice = await prisma.tbl_devices.findMany({
                where: { ip } 
            })

            if(hasDevice){
                const hasUpdate = await prisma.tbl_user.update({
                    where: {
                        id_user: user.id_user
                    },
                    data: {
                        password: pass
                    }
                });

                if(hasUpdate){
                    return {
                        'code' : 1,
                        'msg' : 'Usuário atualizado corretamente'
                    }
                } else {
                    return {
                        'code' : 2,
                        'msg' : 'Dados iguais a base de dados'
                    }
                }
            } else {
                return {
                    'code' : 7,
                    'msg' : 'Dispositvo de acesso diferente'
                }
            }
        } else {
            return {
                'code' : 6,
                'msg' : 'Usuário inexistente'
            } 
        }
    } else {
        //UPDATE IP
        try {
            const user = await prisma.tbl_user.findUnique({
                where: { email },
                select: { id_user: true }
            })
    
            const updateIp = await prisma.tbl_devices.create({
                data: {
                    ip,
                    FK_id_user: user?.id_user,
                    status: 1
                }
            });

            await prisma.tbl_devices.updateMany({
                where: { status: 1 },
                data: { status: 2 }
            })
    
            if(updateIp){
                return {
                    'code' : 1,
                    'msg' : 'Ip atualizado corretamente'
                }
            } else {
                return {
                    'code' : 2,
                    'msg' : 'Houve um erro ao na atualização do ip'
                }
            }    
        } catch (error) {
            return {
                'status' : 'error',
                'err' : error
            }
        }
    }
}

interface updateCoordinateProps{
    id_user: number,
    coordinate: string
}
export async function updateCoordinate({ id_user, coordinate }: updateCoordinateProps){
    try {
        const hasUpdate = await prisma.tbl_user.update({
            where: { id_user },
            data: { coordinate }
        })

        if(hasUpdate){
            return {
                'code' : 1,
                'msg' : 'Coordenadas atualizadas corretamente'
            }
        } else {
            return {
                'code' : 2,
                'msg' : 'Houve um erro ao atualizar as coordenadas'
            }
        }
    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        }
    }
}