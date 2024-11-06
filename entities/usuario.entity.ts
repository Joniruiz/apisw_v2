import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UsuarioEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'usuario' })
  rol: string;
}
