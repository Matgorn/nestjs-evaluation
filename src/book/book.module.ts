import { Injectable, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';
import { AuthorsModule } from 'src/author/author.module';

import { BooksService } from './book.service';
import { BooksController } from './book.controller';

import { Author } from 'src/author/entities/author.entity';
import { Book } from './entities/book.entity';
import { Supply } from 'src/supply/entities/supply.entity';
import { DbFileModule } from 'src/db-file/db-file.module';
import { NotificationModule } from 'src/notification/notification.module';

@Injectable()
export class TestFactory {
  create() {
    return 'Some test string';
  }
}

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, Author, Supply]),
    AuthModule,
    AuthorsModule,
    DbFileModule,
    NotificationModule,
  ],
  controllers: [BooksController],
  providers: [
    BooksService,
    TestFactory,
    {
      provide: 'TEST',
      useFactory: (testFactory: TestFactory) => testFactory.create(),
      inject: [TestFactory],
    },
  ],
  exports: [BooksService],
})
export class BooksModule {}
