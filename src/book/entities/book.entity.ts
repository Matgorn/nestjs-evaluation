import { Author } from 'src/author/entities/author.entity';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', width: 13 })
  @Index()
  isbn: string;

  @Column()
  @Index({ fulltext: true })
  title: string;

  @Column()
  @Index({ fulltext: true })
  subtitle: string;

  @JoinTable()
  @ManyToMany(() => Author, (author) => author.books, {
    cascade: true,
  })
  authors: Author[];
}
