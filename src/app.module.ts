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
import { NotificationModule } from './notification/notification.module';
import * as Joi from '@hapi/joi';

@Module({
  providers: [
    {
      provide: 'PORT',
      useValue: 8000,
    },
  ],
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        EMAIL_SERVICE: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        POSTGRES_DATABASE: Joi.string().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_USERNAME: Joi.string().required(),
      }),
    }),
    AuthModule,
    UserModule,
    DatabaseModule,
    BooksModule,
    AuthorsModule,
    SuppliesModule,
    RolesModule,
    MailModule,
    DbFileModule,
    NotificationModule,
  ],
})
export class AppModule {}
