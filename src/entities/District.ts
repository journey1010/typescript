import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Province } from './Province';
import { Department } from './Department';

@Entity('districts')
export class District {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 200 })
    name: string;

    @Column({ type: 'varchar', length: 2 })
    department_id: string;

    @Column({ type: 'int' })
    province_id: number;

    @CreateDateColumn({ type: 'timestamptz', nullable: true })
    created_at: Date;

    @ManyToOne(() => Department)
    @JoinColumn({ name: 'department_id' })
    department: Department;

    @ManyToOne(() => Province, (province) => province.districts)
    @JoinColumn({ name: 'province_id' })
    province: Province;
}
