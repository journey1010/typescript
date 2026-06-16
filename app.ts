import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './src/Datasource';
import { runUbigeoSeeder } from './src/seeders/ubigeo.seeder';
import ubigeoRoutes from './src/routes/ubigeo.routes';
import authRoutes from './src/routes/auth.routes';
import usersRoutes from './src/routes/users.routes';

dotenv.config();

const app = express();
const PORT = Number(process.env['PORT'] ?? 3000);

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/ubigeo', ubigeoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404
app.use((_req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar servidor
AppDataSource.initialize()
    .then(async () => {
        console.log('✅ Base de datos conectada');
        await runUbigeoSeeder();
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
            console.log('\n📋 Endpoints disponibles:');
            console.log('  GET    /health');
            console.log('  GET    /api/ubigeo/departments');
            console.log('  GET    /api/ubigeo/departments/:id/provinces');
            console.log('  GET    /api/ubigeo/provinces/:id/districts');
            console.log('  POST   /api/auth/register');
            console.log('  POST   /api/auth/login');
            console.log('  POST   /api/auth/refresh');
            console.log('  GET    /api/users           [Bearer token]');
            console.log('  POST   /api/users           [Bearer token]');
            console.log('  PUT    /api/users/:id       [Bearer token]');
            console.log('  DELETE /api/users/:id       [Bearer token]');
        });
    })
    .catch((err) => {
        console.error('❌ Error conectando a la base de datos:', err);
        process.exit(1);
    });