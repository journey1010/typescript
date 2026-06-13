import "reflect-metadata"
import { DataSource } from "typeorm"

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres_password",
    database: "postgres",
    entities: [],
    synchronize: true,
    logging: false,
});