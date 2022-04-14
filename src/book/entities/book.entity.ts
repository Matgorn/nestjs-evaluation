import { Exclude, Expose } from 'class-transformer';
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

export const GROUP_BOOK = 'group_book_details';
export const GROUP_ALL_BOOKS = 'group_all_books';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  @Expose({ groups: [GROUP_BOOK, GROUP_ALL_BOOKS] })
  id: number;

  @Column({ type: 'varchar', width: 13 })
  @Index({ unique: true })
  @Expose({ groups: [GROUP_BOOK, GROUP_ALL_BOOKS] })
  isbn: string;

  @Column()
  @Index({ fulltext: true })
  @Expose({ groups: [GROUP_BOOK, GROUP_ALL_BOOKS] })
  title: string;

  @Column()
  @Index({ fulltext: true })
  @Expose({ groups: [GROUP_BOOK, GROUP_ALL_BOOKS] })
  subtitle: string;

  @JoinColumn({ name: 'coverImageId' })
  @OneToOne(() => DatabaseFile, {
    nullable: true,
  })
  @Expose({ groups: [GROUP_BOOK] })
  coverImage?: DatabaseFile;

  // Increase performance and avoid fetching the binary data unnecessarily
  @Column({ nullable: true })
  @Expose({ groups: [GROUP_BOOK] })
  coverImageId?: number;

  @JoinTable()
  @ManyToMany(() => Author, (author) => author.books, {
    cascade: true,
  })
  @Expose({ groups: [GROUP_BOOK] })
  authors: Author[];

  @OneToMany(() => Supply, (supply) => supply.book, {
    cascade: true,
  })
  @Expose({ groups: [GROUP_BOOK] })
  supplies: Supply[];
}
