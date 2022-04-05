import { Controller, Post, Query } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('email')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('confirm')
  confirmEmail(@Query('token') token: string) {
    return this.mailService.verifyRegisterToken(token);
  }
}
