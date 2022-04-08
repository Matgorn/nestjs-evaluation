import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('files')
class DatabaseFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column({
    type: 'bytea',
  })
  data: Uint8Array;
}

export default DatabaseFile;
