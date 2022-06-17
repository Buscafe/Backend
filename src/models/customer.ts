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
                        password: md5(pass)
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
            
            await prisma.tbl_devices.updateMany({
                where: { status: 1,  FK_id_user: user?.id_user,},
                data: { status: 2 }
            })
    
            const updateIp = await prisma.tbl_devices.create({
                data: {
                    ip,
                    FK_id_user: user?.id_user,
                    status: 1
                }
            });

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

export async function removeIp( id: number ){
    try {
        const removeDevice = await prisma.tbl_devices.delete({
            where: {
                id_device: id
            }
        });

        return {
            'code' : 1,
            'msg'  : 'Dispositivo removido com sucesso'
        }
    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        }
    }
}

export async function changePayment(id_user: number){
    try {
        const updatePayment = await prisma.tbl_user.update({
            data: { isPayed: true },
            where: { id_user }
        });

        return {
            'code' : 1,
            'msg'  : 'Pagamento alterado com sucesso'
        } 
    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        }
    }
}

export async function changeProfilePhoto(id_user: number, image_url: string){
    try {
        const updatePhoto = await prisma.tbl_user.update({
           data: {
            image_url : image_url
           },
           where: {
            id_user: id_user
           }
        });
        console.log(updatePhoto)
        return {
            'code' : 1,
            'msg'  : 'Foto atualizada com sucesso'
        } 
    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        }
    }
}
