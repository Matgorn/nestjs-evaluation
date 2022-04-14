import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class NotificationDto {
  @IsEmail()
  recipentEmail: string;

  @IsString()
  recipentName: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  bookName: string;

  @IsDateString()
  returnDate: string;

  @IsDateString()
  date: string;
}
