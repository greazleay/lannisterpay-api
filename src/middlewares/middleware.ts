import { Request, Response, NextFunction } from "express";
import { RequestWithUser } from "@interfaces/users.interface";
import { decode } from "jsonwebtoken";

export const authorizeJWT = (req: Request, res: Response, next: NextFunction): void | Response => {
    try {
        const authHeader = req.headers['authorization'];
        const token = (authHeader && authHeader.startsWith('Bearer')) && authHeader.split(' ')[1];
        if (!token) throw new Error('No token provided');
        const decoded: any = decode(token);
        if (!decoded.isAdmin) throw new Error('User not authorized to access this resource');
        next();
    } catch (err) {
        if (err instanceof Error) {
            return res.status(403).json(err.message);
        };
    };
};

export const authorize_user = (req: RequestWithUser, res: Response, next: NextFunction): void | Response => {
    try {
        const { isAdmin, tokenVersion } = req.user;
        if (!isAdmin) throw new Error('User not authorized to access this resource');
        next();
    } catch (err) {
        if (err instanceof Error) {
            return res.status(403).json(err.message);
        };
    };
};