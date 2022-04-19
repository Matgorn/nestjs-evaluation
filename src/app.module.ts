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
import * as Joi from '@hapi/joi';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  providers: [
    {
      provide: 'PORT',
      useValue: process.env.APP_PORT || 8000,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      validationSchema: Joi.object({
        EMAIL_SERVICE: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        POSTGRES_DATABASE: Joi.string().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_USERNAME: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        APP_PORT: Joi.number().required(),
      }),
    }),
    AuthModule,
    UserModule,
    DatabaseModule,
    BooksModule,
    AuthorsModule,
    SuppliesModule,
    RolesModule.register({ someValue: 'Some value' }),
    MailModule,
    DbFileModule,
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          service: process.env.EMAIL_SERVICE,
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: `"Reply From:" <Library App>`,
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
})
export class AppModule {}
