import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import sanitize from 'sanitize-html';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly subtitle: string;

  @IsNotEmpty()
  @IsString()
  isbn: string;

  @IsString()
  @Transform(({ value }) => sanitize(value))
  description: string;

  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { each: true },
  )
  authorIds: number[];
}
