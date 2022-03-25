import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AuthorDTO } from './dto/author.dto';
import { Author } from './entities/author.entity';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorsRepository: Repository<Author>,
  ) {}

  async find(id?: Author['id']) {
    if (!id) {
      return this.authorsRepository.find({ relations: ['books'] });
    }

    const foundAuthor = await this.authorsRepository.findOneBy({ id });

    if (!foundAuthor) {
      throw new NotFoundException('Author not found');
    }

    return foundAuthor;
  }

  async findMany(authorIds: Author['id'][]) {
    if (authorIds?.length <= 0) {
      return null;
    }

    return await this.authorsRepository.findBy({
      id: In(authorIds),
    });
  }

  async create(authorDto: AuthorDTO): Promise<Author> {
    const author = await this.authorsRepository.create(authorDto);

    return await this.authorsRepository.save(author);
  }
}
