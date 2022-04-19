import { Factory } from 'rosie';

import { create } from '../helpers/create';
import { Supply } from '@app/supply/entities/supply.entity';

Factory.define<Supply>(Supply.name).attrs({});

export async function createSupply(attributes?: Partial<Supply>) {
  return await create(Supply, attributes);
}
