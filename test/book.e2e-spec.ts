import { Book } from '@book/entities/book.entity';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Repository } from 'typeorm';

import { createAdmin, createAuthor, createBook, createUser } from './factories';
import { getApplication } from './helpers/getApplication';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let bookRepository: Repository<Book>;
  let adminToken: string;
  let userToken: string;

  beforeEach(async () => {
    app = await getApplication();
    bookRepository = app.get(getRepositoryToken(Book));
    const admin = await createAdmin();
    const user = await createUser();

    const { body: adminResponse } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: admin.email,
        password: 'password',
      });

    const { body: userRespose } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: user.email,
        password: 'password',
      });

    adminToken = adminResponse?.access_token;
    userToken = userRespose?.access_token;
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

    it('/books/:id (PATCH)', async () => {
      const [author1, author2, author3] = await Promise.all([
        createAuthor(),
        createAuthor(),
        createAuthor(),
      ]);

      const { id: bookId } = await createBook({
        authors: [author3],
        isbn: '1234567890123',
      });

      const { body } = await request(app.getHttpServer())
        .put(`/books/${bookId}`)
        .send({
          isbn: '9788374323574',
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
      expect(foundBook).toBeNull();
    });
  });
});
