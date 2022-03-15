import Customer from "@src/models/Customer";
import { body } from "express-validator";
import gravatar from "gravatar";
import { Request, Response, NextFunction } from "express";
import { RequestWithCustomer } from "@interfaces/customers.interface";
import { sendMail } from "@utils/sendMail";
import { handleValidationErrors } from "@utils/lib";

export const get_get_customer = async (req: RequestWithCustomer, res: Response) => {
    const { password, resetPassword, refreshToken, ...data } = req.customer._doc;
    res.json(data)
}

export const post_create_customer = [

    body('name', 'What is your name???').trim().isLength({ min: 1 }).escape(),
    body('email').notEmpty().isEmail(),
    body('new_password').notEmpty().isLength({ min: 6 }),

    async (req: Request, res: Response, next: NextFunction) => {
        handleValidationErrors(req, res);

        try {
            const { name, email, new_password, img } = req.body;
            const found_customer = await Customer.findOne({ email: email }).exec();
            if (found_customer) return res.status(409).json({ msg: `Customer with email: ${email} already exists` });
            const avatar = gravatar.url(email, { s: '100', r: 'pg', d: 'retro' }, true);
            const customer = new Customer({
                EmailAddress: email,
                FullName: name,
                password: new_password,
                avatar: avatar || img || ''
            });
            await customer.save();
            const mailOptions: [string, string, string, string] = [
                email,
                'Account Creation',
                `Welcome to Lannister Pay, ${name}`,
                `<p>Dear ${email.split('@')[0]}, Welcome to Lannister Pay, we are excited to have you onboard</p>`
            ];
            await sendMail(...mailOptions);
            const { password, resetPassword, refreshToken, ...data } = customer._doc;
            res.json({ message: 'Customer Created Successfully', customer: data });
        } catch (error) {
            next(error)
        }
    }
];