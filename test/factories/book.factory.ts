import faker from '@faker-js/faker';
import { Factory } from 'rosie';

import { Book } from '../../src/book/entities/book.entity';
import { create } from '../helpers/create';

Factory.define<Book>(Book.name).attrs({
  title: () => faker.commerce.productName(),
  subtitle: () => faker.commerce.product(),
  description: () => faker.commerce.productDescription(),
});

export async function createBook(attributes?: Partial<Book>) {
  return await create(Book, attributes);
}
