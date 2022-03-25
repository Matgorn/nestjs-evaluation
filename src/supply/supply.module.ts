import { Module } from '@nestjs/common';
import { SuppliesService } from './supply.service';
import { SuppliesController } from './supply.controller';
import { BooksModule } from 'src/book/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Supply } from './entities/supply.entity';
import { Book } from 'src/book/entities/book.entity';

@Module({
  imports: [BooksModule, TypeOrmModule.forFeature([Supply, Book])],
  providers: [SuppliesService],
  controllers: [SuppliesController],
  exports: [SuppliesService],
})
export class SuppliesModule {}
