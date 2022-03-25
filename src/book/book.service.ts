import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';

import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
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
    const foundBook = await this.bookRepository.findOneBy({ id });

    if (!foundBook) {
      throw new NotFoundException('Book not found');
    }

    return foundBook;
  }

  async create(book: CreateBookDto) {
    const foundBook = await this.bookRepository.findBy({ isbn: book.isbn });

    if (foundBook.length > 0) {
      throw new ConflictException('Book already exists');
    }

    const newBook = this.bookRepository.create(book);

    return this.bookRepository.save(newBook);
  }

  async update(id: number, book: CreateBookDto) {
    return await this.bookRepository.update({ id }, { ...book });
  }

  async delete(id: number) {
    const book = await this.findById(id);

    await this.bookRepository.delete(id);

    return book;
  }
}
