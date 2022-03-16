import { Router } from "express";
import feeRouter from "@routes/v1/fee.router";

const router: Router = Router();

router.get('/', (req, res) => { res.json({ msg: 'HELLO VISITOR, THANKS FOR STOPPING BY AND WELCOME TO LANNISTER-PAY API' }) });

router.use('/fees', feeRouter);

export default router;