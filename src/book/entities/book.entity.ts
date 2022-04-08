import { Author } from 'src/author/entities/author.entity';
import DatabaseFile from 'src/db-file/entities/db-file.entity';
import { Supply } from 'src/supply/entities/supply.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
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

  @JoinColumn({ name: 'coverImageId' })
  @OneToOne(() => DatabaseFile, {
    nullable: true,
  })
  coverImage?: DatabaseFile;

  // Increase performance and avoid fetching the binary data unnecessarily
  @Column({ nullable: true })
  coverImageId?: number;

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
