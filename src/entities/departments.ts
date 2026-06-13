import {
    Entity,
    PrimaryGeneratedColumn,
    Column
} from 'typeorm';

@Entity()
export class departments {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: 'string'})
    name: string
    
    @Column({type: 'timestamptz', nullable: true})
    created_at: string
}
