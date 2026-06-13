import {
    Entity,
    Column,
    PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class districts {
    @PrimaryGeneratedColumn()
    id: string

    @Column({type: 'string'})
    name: string

    @Column({type: 'string', nullable: true})
    created_at: string
}