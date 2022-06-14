import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import md5 from 'md5'
import { User } from '../types/userTypes';

import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

interface LoginProps{
    email: string;
    pass: string
    ip: string;
}
export async function loginUser({ email, pass, ip }: LoginProps) {
    const user = await prisma.tbl_user.findUnique({
        where: {
            email: email
        },
        select: {
            id_user: true,
            user: true,
            name: true,
            religion: true,
            localization: true,
            coordinate: true,
            email: true,
            type: true,
            password: true,
            isPayed: true
        }
    });

    if(user && md5(pass) === user.password) {
        const devices = await prisma.tbl_devices.findMany({
            where: {
                FK_id_user: user.id_user,
            },
            select: {
                id_device: true,
                ip: true,
                status: true,
                dtCreate: true
            }
        });

        const device = devices.find(device => device.ip === ip);
        if(!device){
            return{
                'code': 9,
                'msg' : 'Dispositivo de acesso diferente'
            }
        }

        let formattedUser: User = {
            "id_user": user.id_user,
            "usuario": user.user,
            "nome": user.name,
            "religiao": user.religion,
            "localizacao": {
                "estado": user.localization.split('/')[0],
                "cidade": user.localization.split('/')[1]
            },
            "coordinate": {
                "lat": Number(user.coordinate?.split(',')[0]),
                "lng": Number(user.coordinate?.split(',')[1])
            },
            "email": user.email,
            "devices": devices
        }

        if(user.type === '1'){
            const secret = process.env.SECRET_JWT ?? '';
            const token = jwt.sign(formattedUser, secret, {
                expiresIn: 300 // expires in 5min
            });
            
            return{
                'code'  : 1,
                'msg'   : 'Conta pessoal',
                'token' : token
            }
        } else {
            const church = await prisma.tbl_corp.findFirst({
                where: { FK_id_user: user.id_user },
                select: { 
                    id_corp: true,
                    corpName: true,
                    roomId: true,
                    coordinate: true,
                    color: true,
                }
            });

            if(church){
                formattedUser.church = {
                    name: church.corpName,
                    roomId: church.roomId,
                    id_corp: church.id_corp,
                    color: church.color,
                    
                };
                formattedUser.coordinate = {
                    lat: Number(church.coordinate?.split(',')[0]),
                    lng: Number(church.coordinate?.split(',')[1])
                };
                formattedUser.isPayed = user.isPayed;
            } else {
                formattedUser.church = null;
            }            
           
            const secret = process.env.SECRET_JWT ?? '';
            const token = jwt.sign(formattedUser, secret, {
                expiresIn: 300 // expires in 5min
            });

            return{
                'code'  : 2,
                'msg'   : 'Conta corporativa',
                'token' : token
            }
        }
    } else {
        return {
            'code': 5, 
            'msg': 'Usuário ou senha inválidos'
        }
    }
}