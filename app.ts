import {
    department, 
    province, 
    district 
} from './types/types';

import { AppDataSource } from './src/Datasource';


//Iniciar conexion a DB
AppDataSource.initialize(); 