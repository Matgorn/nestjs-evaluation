import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbFileController } from './db-file.controller';
import { DbFileService } from './db-file.service';
import DatabaseFile from './entities/db-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DatabaseFile])],
  providers: [DbFileService],
  controllers: [DbFileController],
  exports: [DbFileService],
})
export class DbFileModule {}
