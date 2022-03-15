import { Router } from "express";
import passport from "passport";
import { CustomIRouter } from "@interfaces/routes.interface";
import { get_get_customer, post_create_customer } from "@controllers/customerController";

const customerRouter: CustomIRouter = Router();

customerRouter.get('/customerinfo', passport.authenticate('jwt', { session: false }), get_get_customer);

customerRouter.post('/register', post_create_customer);

export default customerRouter;