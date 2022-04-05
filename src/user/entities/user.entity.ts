import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

import { RoleEntity } from 'src/role/entities/role.entity';
import { Supply } from 'src/supply/entities/supply.entity';

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

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @Column()
  salt: string;

  @Column()
  hash: string;

  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable()
  roles: RoleEntity[];

  @OneToMany(() => Supply, (supply) => supply.owner)
  books: Supply[];

  set password(password: string) {
    this.salt = bcrypt.genSaltSync(10);
    this.hash = bcrypt.hashSync(password, this.salt);
  }

  isPasswordValid(password: string) {
    return bcrypt.compareSync(password, this.hash);
  }
}
