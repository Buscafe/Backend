import { Router } from "express";
import { LoginUserController } from "./controller/acess";
import { UserController } from "./controller/user";
import { ChurchController } from "./controller/church";

const router = Router();

 
const loginUser = new LoginUserController();
const user = new UserController();
const church = new ChurchController();

// Login Routes
router.post('/login', loginUser.handle);

// User routes
router.post('/user/insert', user.insert);
router.post('/user/update', user.update);
router.post('/user/update/coordinate', user.updateCoords);

// Churches routes
router.get('/allChurches/:religion', church.getAll)
router.post('/affiliate', church.joinChurch)

export { router };