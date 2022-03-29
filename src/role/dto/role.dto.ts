import { IsString } from 'class-validator';
import { Role } from '../role.types';

export class RoleDto {
  @IsString()
  name: Role;
}
