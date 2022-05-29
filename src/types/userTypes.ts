export interface User {
    id_user: number;
    usuario: string;
    nome: string;
    religiao: string;
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
    church?: {
        name: string,
        roomId: string | null
    } | null;
}