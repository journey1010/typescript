import { Router, Request, Response } from 'express';
import { AppDataSource } from '../Datasource';
import { Department } from '../entities/Department';
import { Province } from '../entities/Province';
import { District } from '../entities/District';

const router = Router();

/**
 * GET /api/ubigeo/departments
 * Lista todos los departamentos
 */
router.get('/departments', async (_req: Request, res: Response) => {
    try {
        const repo = AppDataSource.getRepository(Department);
        const departments = await repo.find({ order: { name: 'ASC' } });
        res.json({ data: departments });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener departamentos', error });
    }
});

/**
 * GET /api/ubigeo/departments/:departmentId/provinces
 * Lista provincias por departamento
 */
router.get('/departments/:departmentId/provinces', async (req: Request, res: Response) => {
    try {
        const departmentId = String(req.params['departmentId']);
        const repo = AppDataSource.getRepository(Province);
        const provinces = await repo.find({
            where: { department_id: departmentId },
            order: { name: 'ASC' },
        });
        if (provinces.length === 0) {
            res.status(404).json({ message: 'No se encontraron provincias para este departamento' });
            return;
        }
        res.json({ data: provinces });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener provincias', error });
    }
});

/**
 * GET /api/ubigeo/provinces/:provinceId/districts
 * Lista distritos por provincia
 */
router.get('/provinces/:provinceId/districts', async (req: Request, res: Response) => {
    try {
        const provinceId = Number(String(req.params['provinceId']));
        const repo = AppDataSource.getRepository(District);
        const districts = await repo.find({
            where: { province_id: provinceId },
            order: { name: 'ASC' },
        });
        if (districts.length === 0) {
            res.status(404).json({ message: 'No se encontraron distritos para esta provincia' });
            return;
        }
        res.json({ data: districts });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener distritos', error });
    }
});

export default router;
