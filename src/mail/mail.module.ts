import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { MailConsumer } from './mail.consumer';
import { MailService } from './mail.service';

console.log(join(__dirname, 'templates'));

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          service: 'gmail',
          secure: false,
          auth: {
            user: 'testsendgrid96@gmail.com',
            pass: 'polkilop1',
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: `"Reply From:" <testsendgrid96@gmail.com>`,
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
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'mail-job',
    }),
  ],
  providers: [MailService, MailConsumer],
  exports: [MailService],
})
export class MailModule {}
