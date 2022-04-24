import { rooms } from '../services/room' 

export async function findRooms(id_user: number, church_name: String){
    try {
        const allRooms = await rooms.find({
            name: church_name,
            chats: {
                $elemMatch: {
                    users: {
                        $elemMatch: { id_user }
                    }
                }
            }
        });
        return allRooms
    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}
export async function findChurches(id_user: number){
    try {
        const allChurches = await rooms.find({
            chats: {
                $elemMatch: {
                    users: {
                        $elemMatch: { id_user }
                    }
                }
            }
        });

        return allChurches
    } catch (error) {
        return {
            'status' : 'error',
            'err' : error
        } 
    }
}