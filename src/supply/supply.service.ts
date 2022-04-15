import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { BooksService } from 'src/book/book.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { SupplyDTO } from './dto/supply.dto';
import { Supply } from './entities/supply.entity';
import { SupplyStatus } from './supply.types';

@Injectable()
export class SuppliesService {
  constructor(
    @InjectRepository(Supply)
    private readonly supplyRepository: Repository<Supply>,
    private readonly booksService: BooksService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    console.log(this.configService.get<string>('supply.someValue'));
    console.log(this.configService.get<string>('POSTGRES_USERNAME'));
  }

  async list() {
    return await this.supplyRepository.find({
      relations: { book: { authors: true } },
    });
  }

  async findById(id: Supply['id']) {
    const supply = await this.supplyRepository.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (!supply) {
      throw new NotFoundException('Supply not found');
    }

    return supply;
  }

  async create(supply: SupplyDTO) {
    const book = await this.booksService.findById(supply.bookId);

    const newSupply = await this.supplyRepository.create({
      bookId: book.id,
    });

    return await this.supplyRepository.save(newSupply);
  }

  async delete(id: Supply['id']) {
    const supply = this.findById(id);

    await this.supplyRepository.delete(id);

    return supply;
  }

  async borrow(id: Supply['id'], userId: User['id']) {
    const supply = await this.findById(id);
    const owner = await this.userService.findById(userId);

    if (supply.status === SupplyStatus.BORROWED) {
      throw new ConflictException();
    }

    return this.supplyRepository.save({
      ...supply,
      status: SupplyStatus.BORROWED,
      owner,
    });
  }

  async return(id: Supply['id'], userId: User['id']) {
    const supply = await this.findById(id);

    if (supply.owner?.id !== userId) {
      throw new UnauthorizedException();
    }

    return await this.supplyRepository.save({
      ...supply,
      status: SupplyStatus.AVAILABLE,
      owner: null,
    });
  }

  async lost(id: Supply['id']) {
    const supply = await this.findById(id);

    return this.supplyRepository.save({
      ...supply,
      status: SupplyStatus.LOST,
      owner: null,
    });
  }
}
