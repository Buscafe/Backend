export interface User {
    id_user: number;
    usuario: string;
    nome: string;
    religiao: string;
    isPayed?: boolean | null;
    localizacao: {
        estado: string,
        cidade: string
    };
    coordinate: {
        lat: number,
        lng: number
    };
    email: string;
    devices: { 
        id_device: number,
        ip: string,
        status: number | null,
        dtCreate: Date | null 
    }[];
    image_url: string | null,
    church?: {
        name: string,
        roomId: string | null,
        id_corp: number,
        color: string | null,
    } | null;
    id_doc?: number
}