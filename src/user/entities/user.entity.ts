import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

import { RoleEntity } from 'src/role/entities/role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ name: 'first_name' })
  firstName: string;

  @Index()
  @Column({ name: 'last_name' })
  lastName: string;

  @Index({ fulltext: true, unique: true })
  @Column()
  email: string;

  @Column()
  salt: string;

  @Column()
  hash: string;

  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable()
  roles: RoleEntity[];

  set password(password: string) {
    this.salt = bcrypt.genSaltSync(10);
    this.hash = bcrypt.hashSync(password, this.salt);
  }

  isPasswordValid(password: string) {
    return bcrypt.compareSync(password, this.hash);
  }
}
