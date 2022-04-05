import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(@InjectQueue('mail-job') private emailQueue: Queue) {}

  async sendUserConfirmation(user: User) {
    await this.emailQueue.add('mail-queue', {
      user,
    });
  }
}
