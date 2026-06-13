import { 
    Entity,
    Column,
    PrimaryGeneratedColumn 
} from 'typeorm';

@Entity()
export class provinces {
    
    @PrimaryGeneratedColumn()
    id: string;

    @Column({type: 'string'})
    name: string;

    @Column({type: 'timestamptz'})
    created_at: string;
}

