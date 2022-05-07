import { Router } from "express";
import { LoginUserController } from "./controller/acess";
import { UserController } from "./controller/user";
import { ChurchController } from "./controller/church";
import { ChatController } from "./controller/chat";

const router = Router();

const loginUser = new LoginUserController();
const user      = new UserController();
const church    = new ChurchController();
const chat      = new ChatController();

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

// Churches routes
router.get('/allChurches/:religion', church.getAll)
router.post('/affiliate', church.joinChurch)

export { router };