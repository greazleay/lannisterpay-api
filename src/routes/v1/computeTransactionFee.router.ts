import { Router } from "express";
import { CustomIRouter } from "@interfaces/routes.interface";
import { post_compute_transaction_fee } from "@controllers/computeTransactionFeeController";

const computeTransactionFeeRouter: CustomIRouter = Router();

computeTransactionFeeRouter.post('/', post_compute_transaction_fee);

export default computeTransactionFeeRouter;