import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name' })
  @Index()
  firstName: string;

  @Column({ name: 'last_name' })
  @Index()
  lastName: string;

  @Column()
  email: string;

  @Column()
  salt: string;

  @Column()
  hash: string;

  set password(password: string) {
    this.salt = bcrypt.genSaltSync(10);
    this.hash = bcrypt.hashSync(password, this.salt);
  }

  isPasswordValid(password: string) {
    console.log(password);
    return bcrypt.compareSync(password, this.hash);
  }
}
