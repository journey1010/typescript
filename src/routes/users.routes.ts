import { Router, Request, Response } from 'express';
import { AppDataSource } from '../Datasource';
import { User } from '../entities/User';
import { authMiddleware, AuthRequest } from '../middlewares/auth.middleware';

const router = Router();

// Todos los endpoints de usuarios requieren autenticación
router.use(authMiddleware);

/**
 * GET /api/users
 * Lista todos los usuarios (sin contraseña)
 */
router.get('/', async (_req: Request, res: Response) => {
    try {
        const userRepo = AppDataSource.getRepository(User);
        const users = await userRepo.find({
            select: {
                id: true,
                name: true,
                email: true,
                dni: true,
                created_at: true,
                updated_at: true,
            },
            order: { name: 'ASC' },
        });
        res.json({ data: users });

    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios', error });
    }
});

/**
 * POST /api/users
 * Crear un nuevo usuario
 * Body: { name, email, password, dni }
 */
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, email, password, dni } = req.body as {
            name?: string;
            email?: string;
            password?: string;
            dni?: string;
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

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            data: { id: saved.id, name: saved.name, email: saved.email, dni: saved.dni },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear usuario', error });
    }
});

/**
 * PUT /api/users/:id
 * Actualizar usuario
 * Body: { name?, email?, password?, dni? }
 */
router.put('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const id = Number(req.params['id']);
        const { name, email, password, dni } = req.body as {
            name?: string;
            email?: string;
            password?: string;
            dni?: string;
        };

        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({ where: { id } });

        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password;
        if (dni) user.dni = dni;

        const saved = await userRepo.save(user);

        res.json({
            message: 'Usuario actualizado exitosamente',
            data: { id: saved.id, name: saved.name, email: saved.email, dni: saved.dni },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar usuario', error });
    }
});

/**
 * DELETE /api/users/:id
 * Eliminar usuario
 */
router.delete('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const id = Number(req.params['id']);
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({ where: { id } });

        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }

        await userRepo.remove(user);
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuario', error });
    }
});

export default router;
