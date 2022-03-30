import {
  Column,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Role } from '../role.types';
import { User } from 'src/user/entities/user.entity';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role['User'],
  })
  @Index()
  name: Role;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
