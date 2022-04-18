import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';

@Processor('mail-job')
export class MailConsumer {
  constructor(
    private mailerService: MailerService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly jwtService: JwtService,
  ) {}

  @Process('register-queue')
  async readOperationJob(job: Job) {
    const { user } = job.data;
    const payload = { email: user.email };
    const token = this.jwtService.sign(payload);

    await this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Welcome to Library',
        template: 'register',
        context: {
          name: user.firstName,
          token,
        },
      })
      .catch((e) => {
        throw new HttpException(e.message, 500);
      });
  }

  @Process('notification-queue')
  async readNotificationJob(job: Job) {
    const { emailSchedule } = job.data;
    await this.mailerService
      .sendMail({
        to: emailSchedule.recipentEmail,
        subject: 'Notification about returning borrowed book',
        template: 'notification',
        context: {
          name: emailSchedule.recipentName,
          book: emailSchedule.bookName,
          returnDate: emailSchedule.returnDate,
        },
      })
      .catch((e) => {
        throw new HttpException(e.message, 500);
      });
  }
}
