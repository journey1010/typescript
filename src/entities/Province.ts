import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany
} from 'typeorm';
import { Department } from './Department';
import { District } from './District';

@Entity('provinces')
export class Province {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 150 })
    name: string;

    @Column({ type: 'varchar', length: 2 })
    department_id: string;

    @CreateDateColumn({ type: 'timestamptz', nullable: true })
    created_at: Date;

    @ManyToOne(() => Department, (department) => department.provinces)
    @JoinColumn({ name: 'department_id' })
    department: Department;

    @OneToMany(() => District, (district) => district.province)
    districts: District[];
}
