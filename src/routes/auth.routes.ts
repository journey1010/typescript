import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AppDataSource } from '../Datasource';
import { User } from '../entities/User';

dotenv.config();

const router = Router();

const JWT_SECRET = process.env['JWT_SECRET'] ?? 'secret';
const JWT_REFRESH_SECRET = process.env['JWT_REFRESH_SECRET'] ?? 'refresh_secret';
const JWT_EXPIRES_IN = (process.env['JWT_EXPIRES_IN'] ?? '15m') as jwt.SignOptions['expiresIn'];
const JWT_REFRESH_EXPIRES_IN = (process.env['JWT_REFRESH_EXPIRES_IN'] ?? '7d') as jwt.SignOptions['expiresIn'];

function generateTokens(userId: number) {
    const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
    return { accessToken, refreshToken };
}

/**
 * POST /api/auth/register
 * Registro público - crea usuario y retorna tokens
 * Body: { name, email, password, dni }
 */
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { name, email, password, dni } = req.body as {
            name?: string; email?: string; password?: string; dni?: string;
        };
        if (!name || !email || !password || !dni) {
            res.status(400).json({ message: 'Nombre, email, contraseña y DNI son requeridos' });
            return;
        }
        const userRepo = AppDataSource.getRepository(User);
        const existing = await userRepo.findOne({ where: [{ email }, { dni }] });
        if (existing) {
            res.status(409).json({ message: 'El email o DNI ya está registrado' });
            return;
        }
        const user = userRepo.create({ name, email, password, dni });
        const saved = await userRepo.save(user);
        const { accessToken, refreshToken } = generateTokens(saved.id);
        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            data: {
                accessToken,
                refreshToken,
                user: { id: saved.id, name: saved.name, email: saved.email, dni: saved.dni },
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as { email?: string; password?: string };
        if (!email || !password) {
            res.status(400).json({ message: 'Email y contraseña son requeridos' });
            return;
        }

        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({ where: { email } });
        if (!user) {
            res.status(401).json({ message: 'Credenciales inválidas' });
            return;
        }

        const valid = await user.comparePassword(password);
        if (!valid) {
            res.status(401).json({ message: 'Credenciales inválidas' });
            return;
        }

        const { accessToken, refreshToken } = generateTokens(user.id);

        res.json({
            message: 'Login exitoso',
            data: {
                accessToken,
                refreshToken,
                user: { id: user.id, name: user.name, email: user.email, dni: user.dni },
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
});

/**
 * POST /api/auth/refresh
 * Body: { refreshToken }
 */
router.post('/refresh', async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body as { refreshToken?: string };
        if (!refreshToken) {
            res.status(400).json({ message: 'Refresh token requerido' });
            return;
        }

        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: number };

        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({ where: { id: decoded.userId } });
        if (!user) {
            res.status(401).json({ message: 'Usuario no encontrado' });
            return;
        }

        const tokens = generateTokens(user.id);

        res.json({
            message: 'Token renovado exitosamente',
            data: {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            },
        });
    } catch {
        res.status(401).json({ message: 'Refresh token inválido o expirado' });
    }
});


// =============================================================================
router.post('/login-unsafe', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as { email?: string; password?: string };

        if (!email || !password) {
            res.status(400).json({ message: 'Email y contraseña son requeridos' });
            return;
        }

        //  VULNERABLE: entrada del usuario interpolada directamente en el SQL
        const rawSql = `
            SELECT id, name, email, dni, created_at, updated_at
            FROM users
            WHERE email = '${email}'
              AND password = '${password}' 
            LIMIT 1
        `;

        // Exponer la query generada para que se vea el ataque
        console.warn('[SQL-INJECTION-DEMO] Query ejecutada:\n', rawSql);

        const result: unknown[] = await AppDataSource.query(rawSql);

        if (!result || result.length === 0) {
            res.status(401).json({
                message: 'Credenciales inválidas',
                debug_query: rawSql,          // ← en un sistema real NUNCA exponer esto
            });
            return;
        }

        res.json({
            message: 'Login exitoso (ruta VULNERABLE)',
            rows_returned: result.length,
            data: result,
            debug_query: rawSql,
        });
    } catch (error) {
        // Exponer el error también — útil para ver errores de sintaxis SQL del atacante
        res.status(500).json({ message: 'Error SQL', error: String(error) });
    }
});

export default router;
