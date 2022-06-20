import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function insertDoc(cpf: string, cnpj: string, id_user: number){
    try {
        const hasInsert = await prisma.tbl_doc.findFirst({
            where: { cpf, cnpj }
        })

        if(!hasInsert){
            const doc = await prisma.tbl_doc.create({
                data: { cpf, cnpj, FK_id_user: id_user },
                select: { id_doc: true }
            });
            
            return {
                'code': 1,
                'msg' : 'Sucesso na inserção dos documentos',
                'id'  : doc.id_doc  
            }
        } else {
            return {
                'code': 2,
                'err' : 'Documentos já registrados',
            }
        }
    } catch (err) {
        return {
            'code': 3,
            'err' : err 
        }
    }
}