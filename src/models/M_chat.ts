import { rooms } from '../services/room' 

export async function findRooms(id_user: number){
    try {
        const allRooms = await rooms.find({
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