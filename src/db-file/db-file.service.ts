import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import DatabaseFile from './entities/db-file.entity';

@Injectable()
export class DbFileService {
  constructor(
    @InjectRepository(DatabaseFile)
    private databaseFilesRepository: Repository<DatabaseFile>,
  ) {}

  async getFileById(id: number) {
    const file = await this.databaseFilesRepository.findOne({ where: { id } });

    if (!file) {
      throw new NotFoundException();
    }

    return file;
  }

  async uploadDatabaseFileWithQueryRunner(
    dataBuffer: Buffer,
    filename: DatabaseFile['filename'],
    queryRunner: QueryRunner,
  ) {
    const newFile = await queryRunner.manager.create(DatabaseFile, {
      filename,
      data: dataBuffer,
    });

    await queryRunner.manager.save(DatabaseFile, newFile);

    return newFile;
  }

  async deleteFileWithQueryRunner(
    fileId: DatabaseFile['id'],
    queryRunner: QueryRunner,
  ) {
    const deleteResponse = await queryRunner.manager.delete(
      DatabaseFile,
      fileId,
    );

    if (!deleteResponse.affected) {
      throw new NotFoundException();
    }
  }
}
