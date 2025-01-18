import { Router } from "express";
import AuthController from "../controller/AuthController";

const router=Router()
const Auth=new AuthController()
router.post('/register',Auth.register)
router.post('/login',Auth.login)
router.post('/getUser',Auth.getUser)
export default router