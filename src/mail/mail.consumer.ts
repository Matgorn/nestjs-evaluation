import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Processor('mail-job')
export class MailConsumer {
  constructor(
    private mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) {}

  @Process('mail-queue')
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
}
