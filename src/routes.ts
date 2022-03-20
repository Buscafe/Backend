import { Router } from "express";
import { LoginUserController } from "./controller/acess";
import { UserController } from "./controller/user";
import { ChurchController } from "./controller/church";

const router = Router();

// Login 
const loginUser = new LoginUserController();
// User
const user = new UserController();
// Churches
const church = new ChurchController();

// Login Routes
router.post('/login', loginUser.handle);
// User routes
router.post('/user/insert', user.insert);
router.post('/user/update', user.update);
// Churches routes
router.get('/allChurches/:religion', church.getAll)

export { router };