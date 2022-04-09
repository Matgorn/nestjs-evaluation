import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorsService } from 'src/author/author.service';
import { DbFileService } from 'src/db-file/db-file.service';
import DatabaseFile from 'src/db-file/entities/db-file.entity';
import { SupplyStatus } from 'src/supply/supply.types';
import { Connection, Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private readonly authorsService: AuthorsService,
    private readonly dbFileService: DbFileService,
    private connection: Connection,
  ) {}

  async list() {
    return this.bookRepository.find({
      order: {
        id: 'ASC',
      },
      relations: ['authors', 'supplies'],
    });
  }

  async findById(id: Book['id']) {
    const foundBook = await this.bookRepository.findOne({
      where: {
        id,
      },
      relations: { authors: true, supplies: true },
    });

    if (!foundBook) {
      throw new NotFoundException('Book not found');
    }

    return foundBook;
  }

  async getBookInfoById(id: Book['id']) {
    const foundBook = await this.bookRepository.findOne({
      where: {
        id,
        supplies: {
          status: SupplyStatus.AVAILABLE,
        },
      },
      relations: { authors: true, supplies: true },
    });

    if (!foundBook) {
      throw new NotFoundException('Book not found');
    }

    return {
      ...foundBook,
      supplyCount: foundBook.supplies.length,
    };
  }

  async create(book: CreateBookDto) {
    const { isbn, authorIds } = book;

    const foundBook = await this.bookRepository.findBy({ isbn });
    const foundAuthors = await this.authorsService.findMany(authorIds);

    if (foundBook.length > 0) {
      throw new ConflictException('Book already exists');
    }

    const newBook = this.bookRepository.create(book);

    return this.bookRepository.save({
      ...newBook,
      authors: foundAuthors,
    });
  }

  async update(id: Book['id'], book: UpdateBookDto) {
    const foundBook = await this.findById(id);
    const { authorIds, ...bookUpdate } = book;

    const foundAuthors =
      (authorIds &&
        (await Promise.all(
          authorIds.map(
            async (authorId) => await this.authorsService.findById(authorId),
          ),
        ))) ||
      [];

    return this.bookRepository.save({
      ...foundBook,
      ...bookUpdate,
      ...(book?.authorIds && { authors: foundAuthors }),
    });
  }

  async delete(id: Book['id']) {
    const book = await this.findById(id);

    await this.bookRepository.delete(id);

    return book;
  }

  async addCoverImage(
    bookId: Book['id'],
    imageBuffer: Buffer,
    filename: DatabaseFile['filename'],
  ) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const book = await queryRunner.manager.findOne(Book, {
        where: { id: bookId },
      });
      const currentCoverId = book.coverImageId;
      const coverImage =
        await this.dbFileService.uploadDatabaseFileWithQueryRunner(
          imageBuffer,
          filename,
          queryRunner,
        );

      await queryRunner.manager.save(Book, {
        ...book,
        coverImageId: coverImage.id,
      });

      if (currentCoverId) {
        await this.dbFileService.deleteFileWithQueryRunner(
          currentCoverId,
          queryRunner,
        );
      }

      await queryRunner.commitTransaction();

      return coverImage;
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }
}
