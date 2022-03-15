import { Router } from "express";
import authRouter from "@routes/v1/auth.router";
import customerRouter from "@routes/v1/customer.router";
import feeRouter from "@routes/v1/fee.router";
import passwordRouter from "@routes/v1/password.router";

const router: Router = Router();

router.get('/', (req, res) => { res.json({ msg: 'HELLO VISITOR, THANKS FOR STOPPING BY AND WELCOME TO LANNISTER-PAY API' }) });

router.use('/auth', authRouter);
router.use('/password', passwordRouter);
router.use('/customer', customerRouter);
router.use('/fees', feeRouter);

export default router;