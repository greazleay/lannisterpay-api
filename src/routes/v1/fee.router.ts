import { Router } from "express";
import passport from "passport";
import { CustomIRouter } from "@interfaces/routes.interface";
import { post_create_fcs } from "@controllers/feeController";

const feeRouter: CustomIRouter = Router();

feeRouter.post('/', post_create_fcs);

export default feeRouter;