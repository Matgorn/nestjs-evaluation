import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { NotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  sendNotification(emailSchedule: NotificationDto) {
    const job = new CronJob(emailSchedule.date, async () => {
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
    });

    this.schedulerRegistry.addCronJob(
      `${Date.now()}-${emailSchedule.recipentName}`,
      job,
    );
    job.start();
  }
}
