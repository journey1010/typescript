import {
    UpperCaseStrategy,
    LowerCaseStrategy
}  from '../src/TextTransform';
import * as path from 'path';
import * as fs from 'fs/promises'; 

export class UbigeoProcessor {
    public async run() {
        const districtPath = path.join(
            process.cwd(), 
            'resources/ubigeo_peru_2016_distritos.json'
        );
        const departmentPath = path.join(
            process.cwd(), 
            'resources/ubigeo_peru_2016_departamentos.json'
        );
        
        const provincesPath = path.join(
            process.cwd(),
            'ubigeo_peru_2016_provincias.json'
        );

        const [departmentsData, provincesData, districtData] = await Promise.all([
            async () => {
                return JSON.parse(await fs.readFile(departmentPath, 'utf-8'))
            },
            async () => {
                return JSON.parse(await fs.readFile(provincesPath, 'utf-8'));
            }, 
            async () => {
                return JSON.parse(await fs.readFile(provincesPath, 'utf-8'));
            }
        ])
    }
}