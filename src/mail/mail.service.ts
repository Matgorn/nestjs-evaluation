import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { NotificationDto } from '@app/mail/dto/notification.dto';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue('mail-job') private emailQueue: Queue,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async sendUserConfirmation(user: User) {
    await this.emailQueue.add('register-queue', {
      user,
    });
  }

  async verifyRegisterToken(token: string) {
    const { email } = await this.jwtService.verify(token);

    await this.userService.confirmEmailAdress(email);

    return email + ' confirmed';
  }

  async sendNotification(emailSchedule: NotificationDto) {
    await this.emailQueue.add('notification-queue', {
      emailSchedule,
    });
  }
}
