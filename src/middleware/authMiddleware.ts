import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import type { Request, Response, NextFunction as Next } from "express";

declare global {
   namespace Express {
      interface Request {
         userData?: {
            userId: string;
         };
      }
   }
}

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = (req: Request, res: Response, next: Next) => {
   try {
      const token = req.cookies.token;
      if (!token) {
         return res
            .status(401)
            .json({ message: "Authentication failed. No token provided." });
      }

      const decodedToken = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
      req.userData = { userId: decodedToken.userId };
      next();
   } catch (error) {
      console.error(error);
      res.status(401).json({
         message: "Authentication failed. Invalid token.",
      });
   }
};
