import { IsNumber } from 'class-validator';

export class SupplyDTO {
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 0,
  })
  bookId: number;
}
