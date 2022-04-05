import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpException } from '@nestjs/common';

@Processor('mail-job')
export class MailConsumer {
  constructor(private mailerService: MailerService) {}

  @Process('mail-queue')
  async readOperationJob(job: Job) {
    const { user } = job.data;

    await this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Welcome to Library',
        template: 'register',
        context: {
          name: user.firstName,
        },
      })
      .catch((e) => {
        throw new HttpException(e.message, 500);
      });
  }
}
