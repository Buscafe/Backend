import { Router } from "express";
import { LoginUserController } from "./controller/acess";
import { UserController } from "./controller/user";
import { ChurchController } from "./controller/church";
import { ChatController } from "./controller/chat";
import { AdminController } from './controller/admin'

const router = Router();

const loginUser = new LoginUserController();
const user      = new UserController();
const church    = new ChurchController();
const chat      = new ChatController();
const admin     = new AdminController();

// Login Routes
router.post('/login', loginUser.handle);

// User routes
router.post('/user/insert', user.insert);
router.post('/user/update', user.update);
router.post('/user/update/coordinate', user.updateCoords);
router.delete('/user/delete/device', user.removeDevice);

// Chat routes
router.get('/social/getRooms/:id_user/:roomId', chat.getRooms);
router.get('/social/getChurches/:id_user', chat.getChurches);
router.post('/social/delete/message/:_id', chat.removeMessage);

// Churches routes
router.get('/allChurches/:religion', church.getAll)
router.post('/affiliate', church.joinChurch)

// Admin routes
router.post('/admin/chat/insert', admin.insertChat);
router.post('/admin/chat/update', admin.updateChat);

router.get('/admin/allChats/:roomId', admin.getChats);
router.get('/admin/allUsers/:_id/:userId', admin.getAllUsers);
router.get('/admin/allUsersChat/:roomId/:_id', admin.getAllUsersChat);


router.delete('/admin/delete/chat/:_id', admin.removeChat);
router.delete('/admin/delete/userChat/:_id/:idUser', admin.removeUserChat);

export { router };