import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorsService } from 'src/author/author.service';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';

import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private readonly authorsService: AuthorsService,
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
      where: { id },
      relations: { authors: true, supplies: true },
    });

    if (!foundBook) {
      throw new NotFoundException('Book not found');
    }

    return foundBook;
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

  async update(id: number, book: CreateBookDto) {
    const foundBook = await this.findById(id);

    const { id: bookId, ...bookData } = foundBook;

    return this.bookRepository.save({
      ...bookData,
      ...book,
      id,
    });
  }

  async delete(id: number) {
    const book = await this.findById(id);

    await this.bookRepository.delete(id);

    return book;
  }
}
