import { registerAs } from '@nestjs/config';

export const supplyConfig = registerAs('supply', () => ({
  someValue: process.env.SOME_VALUE,
}));
