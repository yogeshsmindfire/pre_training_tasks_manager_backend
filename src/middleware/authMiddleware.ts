import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = (req: any, res: any, next: any) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Authentication failed. No token provided.' });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed. Invalid token.' });
  }
};