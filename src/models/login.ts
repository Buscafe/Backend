import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import md5 from 'md5'

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
            user: true,
            name: true,
            religion: true,
            localization: true,
            email: true,
            ip: true,
            type: true,
            password: true
        }
    });

    if(user && md5(pass) === user.password) {
        if(user.ip === ip){
            const formattedUser = {
                "usuario": user.user,
                "nome": user.name,
                "religiao": user.religion,
                "localizacao": {
                    "estado": user.localization.split('/')[0],
                    "cidade": user.localization.split('/')[1]
                },
                "email": user.email,
            }

            const secret = process.env.SECRET_JWT ?? '';
            const token = jwt.sign(formattedUser, secret, {
                expiresIn: 300 // expires in 5min
            });

            if(user.type === '1'){
                return{
                    'code'  : 1,
                    'msg'   : 'Conta pessoal',
                    'token' : token
                }
            } else {
                return{
                    'code'  : 2,
                    'msg'   : 'Conta corporativa',
                    'token' : token
                }
            }
        } else {
            return{
                'code': 9,
                'msg' : 'Dispositivo de acesso diferente'
            }
        }
    } else {
        return {
            'code': 5, 
            'msg': 'Usuário ou senha inválidos'
        }
    }
}