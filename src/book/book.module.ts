import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';
import { AuthorsModule } from 'src/author/author.module';

import { BooksService } from './book.service';
import { BooksController } from './book.controller';

import { Author } from 'src/author/entities/author.entity';
import { Book } from './entities/book.entity';
import { Supply } from 'src/supply/entities/supply.entity';
import { DbFileModule } from 'src/db-file/db-file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, Author, Supply]),
    AuthModule,
    AuthorsModule,
    DbFileModule,
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
