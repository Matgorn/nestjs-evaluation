import { Module } from '@nestjs/common';
import { SuppliesService } from './supply.service';
import { SuppliesController } from './supply.controller';
import { BooksModule } from 'src/book/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Supply } from './entities/supply.entity';
import { Book } from 'src/book/entities/book.entity';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { supplyConfig } from './supply.config';
import { MailModule } from '@app/mail/mail.module';

@Module({
  imports: [
    BooksModule,
    UserModule,
    MailModule,
    TypeOrmModule.forFeature([Supply, Book]),
    ConfigModule.forFeature(supplyConfig),
  ],
  providers: [SuppliesService],
  controllers: [SuppliesController],
  exports: [SuppliesService],
})
export class SuppliesModule {}
