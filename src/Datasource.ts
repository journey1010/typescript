import "reflect-metadata"
import { DataSource } from "typeorm";
import { departments } from './entities/departments';
import { districts } from "./entities/districts";
import { provinces } from "./entities/provinces";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres_password",
    database: "postgres",
    entities: [departments,districts,provinces],
    synchronize: true,
    logging: false,
});

