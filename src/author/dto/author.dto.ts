import { IsNotEmpty, IsString } from 'class-validator';

export class AuthorDTO {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  bio: string;
}
