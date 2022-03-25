import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { BooksService } from './book.service';
import { Book } from './entities/book.entity';
import { BooksController } from './book.controller';
import { Author } from 'src/author/entities/author.entity';
import { AuthorsModule } from 'src/author/author.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, Author]),
    AuthModule,
    AuthorsModule,
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
