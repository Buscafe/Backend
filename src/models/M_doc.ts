import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function insertDoc(cpf: string, cnpj: string){
    try {
        const hasInsert = await prisma.tbl_doc.findFirst({
            where: { cpf, cnpj }
        })

        if(!hasInsert){
            await prisma.tbl_doc.create({ data: { cpf, cnpj } });
    
            return {
                'code': 1,
                'msg' : 'Sucesso na inserção dos documentos',
            }
        } else {
            return {
                'code': 2,
                'err' : 'Documentos já registrados',
            }
        }
    } catch (err) {
        return {
           
            'err' : err 
        }
    }
}