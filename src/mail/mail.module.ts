import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { MailConsumer } from './mail.consumer';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
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
    ScheduleModule.forRoot(),
    forwardRef(() => UserModule),
  ],
  providers: [MailService, MailConsumer],
  exports: [MailService],
  controllers: [MailController],
})
export class MailModule {}
