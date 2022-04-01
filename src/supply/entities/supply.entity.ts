import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Book } from 'src/book/entities/book.entity';
import { SupplyStatus } from '../supply.types';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Supply {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Book, (book) => book.supplies)
  @JoinTable()
  book: Book;

  @Column({
    type: 'enum',
    enum: SupplyStatus,
    default: SupplyStatus['AVAILABLE'],
  })
  @Index()
  status: SupplyStatus;

  @ManyToOne(() => User, (user) => user.books)
  owner?: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
