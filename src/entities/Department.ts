import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    OneToMany
} from 'typeorm';
import { Province } from './Province';

@Entity('departments')
export class Department {
    @PrimaryColumn({ type: 'varchar', length: 2 })
    id: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @CreateDateColumn({ type: 'timestamptz', nullable: true })
    created_at: Date;

    @OneToMany(() => Province, (province) => province.department)
    provinces: Province[];
}
