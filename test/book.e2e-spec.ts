import { SupplyStatus } from '@app/supply/supply.types';
import { Book } from '@book/entities/book.entity';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Repository } from 'typeorm';

import { createAuthor, createBook, createSupply } from './factories';
import { getUserToken } from './helpers';
import { getApplication } from './helpers/getApplication';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let bookRepository: Repository<Book>;
  let adminToken: string;
  let userToken: string;
  let userId: number;

  beforeEach(async () => {
    app = await getApplication();
    bookRepository = app.get(getRepositoryToken(Book));
    adminToken = (await getUserToken(app, { isAdmin: true }))?.token;
    const user = await getUserToken(app);
    userToken = user?.token;
    userId = user?.userId;
  });

  it('/books/borrow/:id (PUT)', async () => {
    const { id: bookId } = await createBook({
      isbn: '111111111111',
    });
    await Promise.all([
      createSupply({ bookId }),
      createSupply({ bookId }),
      createSupply({ bookId }),
    ]);

    const { body } = await request(app.getHttpServer())
      .put(`/books/borrow/${bookId}`)
      .set({ Authorization: `Bearer ${userToken}` });

    const borrowedBook = await bookRepository.findOne({
      where: { id: body?.bookId },
      relations: {
        supplies: {
          owner: true,
        },
      },
    });

    expect(borrowedBook?.supplies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          status: SupplyStatus.BORROWED,
          owner: expect.objectContaining({
            id: userId,
          }),
        }),
      ]),
    );
  });

  describe('request as admin', () => {
    it('/books (POST)', async () => {
      const author = await createAuthor();

      const { body, statusCode } = await request(app.getHttpServer())
        .post('/books')
        .send({
          title: 'Test Book',
          subtitle: 'Test Subtitle',
          isbn: 'isbn',
          description: 'Test desc',
          authorIds: [author.id],
        })
        .set({ Authorization: `Bearer ${adminToken}` });

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
      expect(body.description).toEqual('Test desc');
      expect(body.authors).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: author.id })]),
      );
    });

    it('/books/:id (PUT)', async () => {
      const [author1, author2, author3] = await Promise.all([
        createAuthor(),
        createAuthor(),
        createAuthor(),
      ]);

      const { id: bookId } = await createBook({
        authors: [author3],
        isbn: '543324232112',
      });

      const { body } = await request(app.getHttpServer())
        .put(`/books/${bookId}`)
        .send({
          isbn: '23412512431',
          title: 'New title',
          subtitle: 'New subtitle',
          description: 'New description',
          authorIds: [author1.id, author2.id],
        })
        .set({ Authorization: `Bearer ${adminToken}` });

      const foundBook = await bookRepository.findOne({
        where: {
          id: body.id,
        },
        relations: ['authors'],
      });

      expect(foundBook).not.toBeNull();
      expect(foundBook?.authors).toHaveLength(2);
      expect(body.title).toEqual('New title');
      expect(body.subtitle).toEqual('New subtitle');
      expect(body.description).toEqual('New description');
      expect(body.authors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: author1.id }),
          expect.objectContaining({ id: author2.id }),
        ]),
      );
    });
  });

  describe('request as non admin user', () => {
    it('/books (POST)', async () => {
      const author = await createAuthor();

      const { body, statusCode } = await request(app.getHttpServer())
        .post('/books')
        .send({
          title: 'Test Book',
          subtitle: 'Test Subtitle',
          isbn: 'isbn',
          description: 'Test desc',
          authorIds: [author.id],
        })
        .set({ Authorization: `Bearer ${userToken}` });

      const foundBook = await bookRepository.findOne({
        where: {
          id: body.id,
        },
        relations: ['authors'],
      });

      expect(statusCode).toEqual(403);
      expect(body?.message).toEqual('Forbidden resource');
      expect(body?.error).toEqual('Forbidden');
      expect(foundBook).toBeNull();
    });

    it('/books/:id (PUT)', async () => {
      const [author1, author2, author3] = await Promise.all([
        createAuthor(),
        createAuthor(),
        createAuthor(),
      ]);

      const { id: bookId } = await createBook({
        authors: [author3],
        isbn: '3253241232131',
      });

      const { body, statusCode } = await request(app.getHttpServer())
        .put(`/books/${bookId}`)
        .send({
          isbn: '9788374323574',
          title: 'New title',
          subtitle: 'New subtitle',
          description: 'New description',
          authorIds: [author1.id, author2.id],
        })
        .set({ Authorization: `Bearer ${userToken}` });

      expect(statusCode).toEqual(403);
      expect(body?.message).toEqual('Forbidden resource');
      expect(body?.error).toEqual('Forbidden');
    });
  });
});
