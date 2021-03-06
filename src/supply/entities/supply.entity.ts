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

import { Book } from '../../book/entities/book.entity';
import { SupplyStatus } from '../supply.types';
import { User } from '../../user/entities/user.entity';

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

  @Column({ nullable: true })
  returnDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
