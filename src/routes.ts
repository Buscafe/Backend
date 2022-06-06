import { Router } from "express";
import { LoginUserController } from "./controller/acess";
import { UserController } from "./controller/user";
import { ChurchController } from "./controller/church";
import { ChatController } from "./controller/chat";
import { AdminController } from './controller/admin'
import { AdminHomeController } from "./controller/adminHome";

const router = Router();

const loginUser = new LoginUserController();
const user      = new UserController();
const church    = new ChurchController();
const chat      = new ChatController();
const admin     = new AdminController();
const adminHome = new AdminHomeController();

// Login Routes
router.post('/login', loginUser.handle);

// User routes
router.post('/user/insert', user.insert);
router.post('/user/update', user.update);
router.post('/user/update/coordinate', user.updateCoords);
router.delete('/user/delete/device/:id', user.removeDevice);

// Chat routes
router.get('/social/getRooms/:id_user/:roomId', chat.getRooms);
router.get('/social/getChurches/:id_user', chat.getChurches);
router.post('/social/delete/message/:chatId/:_id', chat.removeMessage);

// Churches routes
router.get('/allChurches/:idUser/:religion', church.getAll)
router.post('/affiliate', church.joinChurch)

// Admin routes
router.post('/admin/chat/insert', admin.insertChat);
router.post('/admin/chat/update', admin.updateChat);

router.get('/admin/allChats/:roomId', admin.getChats);
router.get('/admin/allUsers/:_id/:userId', admin.getAllUsers);
router.get('/admin/allUsersChat/:roomId/:_id', admin.getAllUsersChat);

router.delete('/admin/delete/chat/:_id', admin.removeChat);
router.delete('/admin/delete/userChat/:_id/:idUser', admin.removeUserChat);

// Admin home routes
router.post('/admin/home/church/insert', adminHome.insertChurch)
router.post('/admin/home/aboutChurch/insert', adminHome.insertAboutChurch)
router.post('/admin/home/meetingsChurch/insert', adminHome.insertMeetingChurch)
router.post('/admin/home/donateChurch/insert', adminHome.insertDonateChurch)

router.get('/admin/home/church/:corpId', adminHome.getChurch)
router.get('/admin/home/aboutChurch/:corpId', adminHome.getAboutChurch)
router.get('/admin/home/meetingsChurch/:corpId', adminHome.getMeetingChurch)
router.get('/admin/home/donateChurch/:corpId', adminHome.getDonateChurch)

router.post('/admin/home/church/update', adminHome.updateChurch)
router.post('/admin/home/aboutChurch/update', adminHome.updateAboutChurch)
router.post('/admin/home/meetingsChurch/update', adminHome.updateMeetingChurch)
router.post('/admin/home/donateChurch/update', adminHome.updateDonateChurch)

router.delete('/admin/home/meetingsChurch/delete', adminHome.deleteMeetingChurch)
router.delete('/admin/home/donateChurch/delete', adminHome.deleteDonateChurch)


export { router };