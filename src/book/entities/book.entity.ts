import { Author } from 'src/author/entities/author.entity';
import { Supply } from 'src/supply/entities/supply.entity';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', width: 13 })
  @Index({ unique: true })
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

  @OneToMany(() => Supply, (supply) => supply.book, {
    cascade: true,
  })
  supplies: Supply[];
}
