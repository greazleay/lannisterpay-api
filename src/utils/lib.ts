import { CookieOptions, Request, Response, NextFunction } from "express";
import { randomBytes } from "crypto";
import { validationResult } from "express-validator";
import { sign } from "jsonwebtoken";
import { ICustomer } from "@interfaces/customers.interface";
import { ITokens } from "@interfaces/auth.interface";
import { ENV } from "@utils/validateEnv";

export const generateRandomCode = async (length: number): Promise<string | null> => {
    try {
        const code = randomBytes(length).toString('hex').toUpperCase();
        return code;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const tokenGenerator = async (customer: ICustomer): Promise<ITokens> => {
    const payload = {
        aud: "https://pollaroid.net",
        iss: "https://pollaroid.net",
        sub: customer._id,
        name: customer.FullName,
        email: customer.EmailAddress,
        avatar: customer.avatar,
        last_login: customer.lastLogin,
        token_version: customer.tokenVersion
    };
    // Process Access token
    const ACCESS_TOKEN_PRIVATE_KEY = Buffer.from(ENV.ACCESS_TOKEN_PRIVATE_KEY_BASE64, 'base64').toString('ascii');
    const token = sign(payload, { key: ACCESS_TOKEN_PRIVATE_KEY, passphrase: ENV.ACCESS_TOKEN_SECRET }, { algorithm: 'RS256', expiresIn: '15m' });

    // Process Refresh token
    const REFRESH_TOKEN_PRIVATE_KEY = Buffer.from(ENV.REFRESH_TOKEN_PRIVATE_KEY_BASE64, 'base64').toString('ascii');
    const refresh_token = sign(payload, { key: REFRESH_TOKEN_PRIVATE_KEY, passphrase: ENV.REFRESH_TOKEN_SECRET }, { algorithm: 'RS256', expiresIn: '7d' });

    return { token, refresh_token };
};

export const cookieOptions: CookieOptions = {
    path: '/api/auth/refresh_token',
    httpOnly: true,
    maxAge: 604800000,
    signed: true,
    sameSite: 'strict',
    secure: true,
};

export const sendTokens = (res: Response, refresh_token: string, msg_txt: string, token: string) => {
    return res
        .cookie('jit', refresh_token, cookieOptions)
        .json({ message: msg_txt, authToken: token });
};

export const handleValidationErrors = (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    };
};