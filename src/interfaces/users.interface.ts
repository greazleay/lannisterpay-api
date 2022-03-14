import { Request } from "express";
import { Document, Types } from "mongoose";
import { ITokens, IValidate, IVerify } from "@interfaces/auth.interface";

interface ResetPassword {
  code: string;
  expiresBy: Date;
}

interface RefreshToken {
  token: string;
  expiresBy: Date;
}

interface IUserGroupSavings {
  savingsGroup: Types.ObjectId,
  amountSaved: number
}

export interface IUser extends Document {
  _doc?: any;
  name: string;
  email: string;
  password: string;
  avatar: string;
  isAdmin: boolean;
  isMember: boolean;
  resetPassword: ResetPassword;
  refreshToken: RefreshToken;
  tokenVersion: number;
  lastLogin: Date;
  savingsGroups: IUserGroupSavings[];
  generateCode: () => Promise<string>;
  generateTokens(usr: IUser): Promise<ITokens>;
  validatePassword(password: string): Promise<boolean>;
  validateRefreshToken(req: Request): Promise<IValidate>;
  verifyCode: (code: string) => Promise<IVerify>;
}

export interface RequestWithUser extends Request {
  user: IUser;
}