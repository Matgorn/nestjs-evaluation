import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { MailConsumer } from './mail.consumer';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

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
    JwtModule.register({
      secret: 'secretmail',
      signOptions: { expiresIn: '100000' },
    }),
    forwardRef(() => UserModule),
  ],
  providers: [MailService, MailConsumer],
  exports: [MailService],
  controllers: [MailController],
})
export class MailModule {}
