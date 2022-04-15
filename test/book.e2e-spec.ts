import { Book } from '@book/entities/book.entity';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Repository } from 'typeorm';

import { createAuthor, createBook } from './factories';
import { getApplication } from './helpers/getApplication';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let bookRepository: Repository<Book>;

  beforeEach(async () => {
    app = await getApplication();
    bookRepository = app.get(getRepositoryToken(Book));
  });

  it('/books (POST)', async () => {
    const author = await createAuthor();

    const { body, statusCode } = await request(app.getHttpServer())
      .post('/books')
      .send({
        title: 'Test Book',
        subtitle: 'Test Subtitle',
        isbn: 'isbn',
        authorIds: [author.id],
      });

    const foundBook = await bookRepository.findOne({
      where: {
        id: body.id,
      },
      relations: ['authors'],
    });

    expect(statusCode).toEqual(201);
    expect(foundBook).not.toBeNull();
    expect(foundBook?.authors).toHaveLength(1);
    expect(body.title).toEqual('Test Book');
    expect(body.subtitle).toEqual('Test Subtitle');
    expect(body.isbn).toEqual('isbn');
    expect(body.authors).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: author.id })]),
    );
  });

  // it('/book/:id (PATCH)', async () => {
  //   const [author1, author2, author3] = await Promise.all([
  //     createAuthor(),
  //     createAuthor(),
  //     createAuthor(),
  //   ]);

  //   const { id: bookId } = await createBook({
  //     authors: [author3],
  //     isbn: '1234567890123',
  //   });

  //   const { body } = await request(app.getHttpServer())
  //     .put(`/books/${bookId}`)
  //     .send({
  //       isbn: '9788374323574',
  //       title: 'New title',
  //       subtitle: 'New subtitle',
  //       authorIds: [author1.id, author2.id],
  //     });

  //   const foundBook = await bookRepository.findOne({
  //     where: {
  //       id: body.id,
  //     },
  //     relations: ['authors'],
  //   });

  //   expect(foundBook).not.toBeNull();
  //   expect(foundBook?.authors).toHaveLength(2);
  //   expect(body.title).toEqual('New title');
  //   expect(body.subtitle).toEqual('New subtitle');
  //   expect(body.authors).toEqual(
  //     expect.arrayContaining([
  //       expect.objectContaining({ id: author1.id }),
  //       expect.objectContaining({ id: author2.id }),
  //     ]),
  //   );
  // });
});
