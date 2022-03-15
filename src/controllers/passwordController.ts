import Customer from "@models/Customer";
import { body, validationResult } from "express-validator";
import { sendMail } from "@utils/sendMail";
import { Request, Response, NextFunction } from "express";
import { RequestWithCustomer } from "@interfaces/customers.interface";
import { handleValidationErrors } from "@utils/lib";

export const post_verification_code = [
    body('email').notEmpty().isEmail(),

    async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        } else {

            try {
                const customer = await Customer.findOne({ email: email }).exec();
                if (!customer) throw new Error(`Customer with email ${email} not found`);
                const code = await customer.generateCode();
                const mailOptions: [string, string, string, string] = [
                    email,
                    'Verification code',
                    `Your verification code is ${code}`,
                    `<p>Please use this code: <strong style='color: red'>${code}</strong> to continue your password reset</p>`
                ];
                await sendMail(...mailOptions);
                res.json({ msg: "Verification Code sent!!!" });
            } catch (err) {
                return next(err)
            }
        }
    }
]

export const put_reset_password = [

    body('email').notEmpty().isEmail(),
    body('code').notEmpty().isLength({ min: 6 }).withMessage('must be at least 6 chars long'),
    body('new_password').notEmpty().isLength({ min: 6 }),

    async (req: Request, res: Response, next: NextFunction) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        } else {
            try {
                const { email, new_password, code } = req.body;
                const customer = await Customer.findOne({ email: email }).exec();
                if (!customer) throw new Error(`No customer with email: ${email} found`);
                const { validCode, codeNotExpired } = await customer.verifyCode(code);
                if (!validCode || !codeNotExpired) return res.status(403).json({ msg: 'Verification code is invalid or it has expired.' });
                customer.password = new_password;
                await customer.save();
                const { password, resetPassword, refreshToken, ...data } = customer._doc;
                res.json({ msg: 'password reset successful', data })
            } catch (err) {
                return next(err);
            }
        }
    }
];

export const put_change_password = [
    body('old_password').notEmpty().isLength({ min: 6 }),
    body('new_password').notEmpty().isLength({ min: 6 }),

    async (req: RequestWithCustomer, res: Response, next: NextFunction) => {

        handleValidationErrors(req, res);

        try {
            const { old_password, new_password } = req.body;

            const customer = await Customer.findById(req.customer._id).exec();
            if (!customer) throw new Error(`No customer with id: ${req.customer._id} found`);

            const validPassword = await customer.validatePassword(old_password);
            if (!validPassword) return res.status(403).json({ msg: 'Old password is invalid' });

            customer.password = new_password;
            await customer.save();

            const { password, resetPassword, refreshToken, tokenVersion, ...data } = customer._doc;
            res.json({ msg: 'password changed successful', data })
        } catch (error) {
            return next(error);
        }
    }
]