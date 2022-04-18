import { Transform } from 'class-transformer';
import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class NotificationDto {
  @IsEmail()
  recipentEmail: string;

  @IsString()
  recipentName: string;

  @IsString()
  @IsNotEmpty()
  bookName: string;

  @IsDateString()
  @Transform(({ value }) => value.toDateString())
  returnDate: string;
}
