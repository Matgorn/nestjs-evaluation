import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(email: User['email'], pass: User['password']) {
    const user = await this.userService.findByEmail(email);

    if (user && user.isPasswordValid(pass)) {
      const { password, ...userData } = user;

      return userData;
    }
    return null;
  }
}
