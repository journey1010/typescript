import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Department } from './entities/Department';
import { Province } from './entities/Province';
import { District } from './entities/District';
import { User } from './entities/User';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env['DB_HOST'] ?? 'localhost',
    port: Number(process.env['DB_PORT'] ?? 5432),
    username: process.env['DB_USER'] ?? 'postgres',
    password: process.env['DB_PASSWORD'] ?? 'postgres_password',
    database: process.env['DB_NAME'] ?? 'postgres',
    entities: [Department, Province, District, User],
    synchronize: true,
    logging: false,
});
