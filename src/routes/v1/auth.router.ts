import { Router } from "express";
import { CustomIRouter } from "@interfaces/routes.interface";
import { get_logout_customer, post_login_customer, post_refresh_token } from "@controllers/authController";


const authRouter: CustomIRouter = Router();

authRouter.get('/logout', get_logout_customer);

authRouter.post('/login', post_login_customer);

authRouter.post('/refresh_token', post_refresh_token);

export default authRouter;