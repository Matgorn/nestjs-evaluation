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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
