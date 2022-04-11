import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BooksModule } from './book/book.module';
import { AuthorsModule } from './author/author.module';
import { SuppliesModule } from './supply/supply.module';
import { RolesModule } from './role/role.module';
import { MailModule } from './mail/mail.module';
import { DbFileModule } from './db-file/db-file.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env.test', '.env'] }),
    AuthModule,
    UserModule,
    DatabaseModule,
    BooksModule,
    AuthorsModule,
    SuppliesModule,
    RolesModule,
    MailModule,
    DbFileModule,
  ],
})
export class AppModule {}
