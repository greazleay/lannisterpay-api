import { Router } from "express";
import authRouter from "@routes/v1/auth.router";
import userRouter from "@routes/v1/user.router";
import passwordRouter from "@routes/v1/password.router";

const router: Router = Router();

router.get('/', (req, res) => { res.json({ msg: 'HELLO VISITOR, THANKS FOR STOPPING BY AND WELCOME TO LANNISTER-PAY API' }) });

router.use('/auth', authRouter);
router.use('/password', passwordRouter);
router.use('/user', userRouter);

export default router;