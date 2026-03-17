import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../utils/config";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, config().bcryptRounds);
  }

  static async verifyPassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateToken(payload: TokenPayload): string {
    const secret = config().jwtSecret;
    const expiresInSeconds = 60 * 60 * 24 * 7; // 7 days
    return jwt.sign(payload, secret, { expiresIn: expiresInSeconds });
  }

  static verifyToken(token: string): TokenPayload {
    return jwt.verify(token, config().jwtSecret) as TokenPayload;
  }
}
