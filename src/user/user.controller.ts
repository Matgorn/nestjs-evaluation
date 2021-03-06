import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  getUser(@Param('id') id: User['id']) {
    return this.usersService.findById(id);
  }

  @Put(':id')
  updateUser(@Param('id') id: User['id'], @Body() userDto: UpdateUserDto) {
    return this.usersService.update(id, userDto);
  }

  @Put('roles/:id')
  updateUserRoles(@Param('id') id: User['id'], @Query('roles') roles: string) {
    return this.usersService.updateRoles(id, roles.split(','));
  }
}
