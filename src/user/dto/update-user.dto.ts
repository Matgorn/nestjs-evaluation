import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';

import { Role } from 'src/role/role.types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  roles: Role[];
}
