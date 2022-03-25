import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { SupplyDTO } from './dto/supply.dto';
import { Supply } from './entities/supply.entity';
import { SuppliesService } from './supply.service';
import { SupplyStatus } from './supply.types';

@Controller('supplies')
export class SuppliesController {
  constructor(private readonly suppliesService: SuppliesService) {}

  @Get()
  async list() {
    return this.suppliesService.list();
  }

  @Post()
  async createSupply(@Body() bookId: SupplyDTO) {
    return this.suppliesService.create(bookId);
  }

  @Delete(':id')
  async deleteSupply(@Param('id', new ParseIntPipe()) id: Supply['id']) {
    return this.suppliesService.delete(id);
  }

  @Post(':id/borrow')
  async borrowSupply(@Param('id', new ParseIntPipe()) id: Supply['id']) {
    return this.suppliesService.updateStatus(id, SupplyStatus['BORROWED']);
  }

  @Post(':id/return')
  async returnSupply(@Param('id', new ParseIntPipe()) id: number) {
    return this.suppliesService.updateStatus(id, SupplyStatus['AVAILABLE']);
  }

  @Post(':id/lost')
  async lostSupply(@Param('id', new ParseIntPipe()) id: number) {
    return this.suppliesService.updateStatus(id, SupplyStatus['LOST']);
  }
}
