import { Book } from '../../book/entities/book.entity';
import {
  Column,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('authors')
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', nullable: true })
  @Index({ fulltext: true })
  firstName: string;

  @Column({ name: 'last_name', nullable: true })
  @Index({ fulltext: true })
  lastName: string;

  @Column({ type: 'text' })
  bio: string;

  @ManyToMany(() => Book, (book) => book.authors)
  books: Book[];
}
