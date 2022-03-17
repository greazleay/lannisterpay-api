import { Router } from "express";
import feeRouter from "@routes/v1/fee.router";
import computeTransactionFeeRouter from "@routes/v1/computeTransactionFee.router";

const router: Router = Router();

router.get('/', (req, res) => { res.json({ msg: 'HELLO VISITOR, THANKS FOR STOPPING BY AND WELCOME TO LANNISTER-PAY API' }) });

router.use('/fees', feeRouter);

router.use('/compute-transaction-fee', computeTransactionFeeRouter);

export default router;