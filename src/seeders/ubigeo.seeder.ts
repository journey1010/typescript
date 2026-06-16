import { AppDataSource } from '../Datasource';
import { Department } from '../entities/Department';
import { Province } from '../entities/Province';
import { District } from '../entities/District';
import * as path from 'path';
import * as fs from 'fs/promises';

interface DepartmentJson {
    id: string;
    name: string;
}

interface ProvinceJson {
    id: number;
    name: string;
    department_id: string;
}

interface DistrictJson {
    id: number;
    name: string;
    department_id: string;
    province_id: number;
}

export async function runUbigeoSeeder() {
    const departmentRepo = AppDataSource.getRepository(Department);
    const provinceRepo = AppDataSource.getRepository(Province);
    const districtRepo = AppDataSource.getRepository(District);

    // Verificar si ya hay datos
    const existingCount = await departmentRepo.count();
    if (existingCount > 0) {
        console.log('⚠️  Ubigeo data already seeded. Skipping...');
        return;
    }

    const departmentPath = path.join(process.cwd(), 'resources/ubigeo_peru_2016_departamentos.json');
    const provincesPath = path.join(process.cwd(), 'resources/ubigeo_peru_2016_provincias.json');
    const districtPath = path.join(process.cwd(), 'resources/ubigeo_peru_2016_distritos.json');

    const [departmentsData, provincesData, districtData] = await Promise.all([
        fs.readFile(departmentPath, 'utf-8').then((d) => JSON.parse(d) as DepartmentJson[]),
        fs.readFile(provincesPath, 'utf-8').then((d) => JSON.parse(d) as ProvinceJson[]),
        fs.readFile(districtPath, 'utf-8').then((d) => JSON.parse(d) as DistrictJson[]),
    ]);

    console.log('🌱 Seeding departments...');
    const departments = departmentsData.map((d) => {
        const dept = new Department();
        dept.id = d.id;
        dept.name = d.name;
        return dept;
    });
    await departmentRepo.save(departments);
    console.log(`✅ ${departments.length} departments seeded`);

    console.log('🌱 Seeding provinces...');
    const provinces = provincesData.map((p) => {
        const province = new Province();
        province.id = p.id;
        province.name = p.name;
        province.department_id = p.department_id;
        return province;
    });
    await provinceRepo.save(provinces);
    console.log(`✅ ${provinces.length} provinces seeded`);

    console.log('🌱 Seeding districts...');
    // Insertar en lotes de 500 para rendimiento
    const batchSize = 500;
    let totalDistricts = 0;
    for (let i = 0; i < districtData.length; i += batchSize) {
        const batch = districtData.slice(i, i + batchSize).map((d) => {
            const district = new District();
            district.id = d.id;
            district.name = d.name;
            district.department_id = d.department_id;
            district.province_id = d.province_id;
            return district;
        });
        await districtRepo.save(batch);
        totalDistricts += batch.length;
        process.stdout.write(`\r  → ${totalDistricts}/${districtData.length} districts...`);
    }
    console.log(`\n✅ ${totalDistricts} districts seeded`);
    console.log('🎉 Ubigeo seeding complete!');
}
