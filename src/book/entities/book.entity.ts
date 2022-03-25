import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

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
}
