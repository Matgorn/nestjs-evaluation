import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
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

  @JoinColumn({ name: 'bookId' })
  @ManyToOne(() => Book, (book) => book.supplies)
  book: Book;

  @Column({ nullable: false })
  bookId: Book['id'];

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
