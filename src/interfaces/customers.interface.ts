import { Request } from "express";
import { Document, Types } from "mongoose";
import { ITokens, IValidate, IVerify } from "@interfaces/auth.interface";

interface ResetPassword {
  code: string;
  expiresBy: Date;
};

interface RefreshToken {
  token: string;
  expiresBy: Date;
};

export interface ICustomer extends Document {
  _doc?: any;
  EmailAddress: string;
  FullName: string;
  BearsFee: boolean;
  password: string;
  avatar: string;
  resetPassword: ResetPassword;
  refreshToken: RefreshToken;
  tokenVersion: number;
  lastLogin: Date;
  generateCode: () => Promise<string>;
  generateTokens(usr: ICustomer): Promise<ITokens>;
  validatePassword(password: string): Promise<boolean>;
  validateRefreshToken(req: Request): Promise<IValidate>;
  verifyCode: (code: string) => Promise<IVerify>;
};

export interface RequestWithCustomer extends Request {
  customer: ICustomer;
};