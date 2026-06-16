import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface AuthRequest extends Request {
    userId?: number;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Token de autorización requerido' });
        return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Token no proporcionado' });
        return;
    }

    try {
        const secret = process.env['JWT_SECRET'] ?? 'secret';
        const decoded = jwt.verify(token, secret) as { userId: number };
        req.userId = decoded.userId;
        next();
    } catch {
        res.status(401).json({ message: 'Token inválido o expirado' });
    }
}
