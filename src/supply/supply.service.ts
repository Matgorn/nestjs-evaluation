import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BooksService } from 'src/book/book.service';
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
  ) {}

  async list() {
    return await this.supplyRepository.find({
      relations: { book: { authors: true } },
    });
  }

  async findById(id: Supply['id']) {
    const supply = await this.supplyRepository.findOneBy({ id });

    if (!supply) {
      throw new NotFoundException('Supply not found');
    }

    return supply;
  }

  async create(supply: SupplyDTO) {
    const book = await this.booksService.findById(supply.bookId);

    const newSupply = await this.supplyRepository.create({
      book,
    });

    return await this.supplyRepository.save(newSupply);
  }

  async delete(id: Supply['id']) {
    const supply = this.findById(id);

    await this.supplyRepository.delete(id);

    return supply;
  }

  async updateStatus(id: Supply['id'], status: SupplyStatus) {
    const supply = await this.findById(id);

    const { id: supplyId, ...supplyData } = supply;

    return this.supplyRepository.save({
      ...supplyData,
      status,
      id,
    });
  }
}
