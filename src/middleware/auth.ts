import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

export default class Authentication {
  static async authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const { authorization } = req.headers;
      let decoded: any;
      if (authorization) {
        try {
          const token = authorization.split(' ')[1];
          decoded = jwt.verify(token, process.env.JWT_KEY);
        } catch (error) {
          return res.status(410).json({
            error: true,
            message: 'Session expired, you have to login.',
          });
        }
        req['decoded'] = decoded;
        return next();
      }
      return res.status(401).json({
        error: true,
        message: 'Sorry, you have to login.',
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: 'Server Error',
      });
    }
  }
}
