import Customer from "@src/models/Customer";
import { body, validationResult } from "express-validator";
import gravatar from "gravatar";
import { Request, Response, NextFunction } from "express";
import { RequestWithCustomer } from "@interfaces/customers.interface";
import { sendMail } from "@utils/sendMail";
import { handleValidationErrors } from "@utils/lib";

export const get_get_user = async (req: RequestWithCustomer, res: Response) => {
    const { password, resetPassword, refreshToken, ...data } = req.customer._doc;
    res.json(data)
}

export const post_create_user = [

    body('name', 'What is your name???').trim().isLength({ min: 1 }).escape(),
    body('email').notEmpty().isEmail(),
    body('new_password').notEmpty().isLength({ min: 6 }),

    async (req: Request, res: Response, next: NextFunction) => {
        handleValidationErrors(req, res);

        try {
            const { name, email, new_password, img } = req.body;
            const found_customer = await Customer.findOne({ email: email }).exec();
            if (found_customer) return res.status(409).json({ msg: 'Customer already exists' });
            const avatar = gravatar.url(email, { s: '100', r: 'pg', d: 'retro' }, true);
            const user = new Customer({
                name: name,
                email: email,
                password: new_password,
                avatar: avatar || img || ''
            });
            await user.save();
            const mailOptions: [string, string, string, string] = [
                email,
                'Account Creation',
                `Welcome to Esusu Confirm`,
                `<p>Dear ${email.split('@')[0]}, Welcome to Esusu Confirm, we are excited to have you onboard</p>`
            ];
            await sendMail(...mailOptions);
            const { password, resetPassword, refreshToken, ...data } = user._doc;
            res.json({ message: 'User Created Successfully', user: data });
        } catch (error) {
            next(error)
        }
    }
];