import {
  IsDate,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class NotificationDto {
  @IsEmail()
  recipentEmail: string;

  @IsString()
  recipentName: string;

  @IsString()
  @IsNotEmpty()
  bookName: string;

  @IsDateString()
  returnDate: string;

  @IsDate()
  date: Date;
}
