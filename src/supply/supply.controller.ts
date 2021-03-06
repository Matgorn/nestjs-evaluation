import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.types';
import { SupplyDTO } from './dto/supply.dto';
import { Supply } from './entities/supply.entity';
import { SuppliesService } from './supply.service';

@Controller('supplies')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(Role.Admin)
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

  @Post(':id/return')
  async returnSupply(
    @Param('id', new ParseIntPipe()) id: number,
    @Request() req,
  ) {
    return this.suppliesService.return(id, req?.user?.userId);
  }

  @Post(':id/lost')
  async lostSupply(@Param('id', new ParseIntPipe()) id: number) {
    return this.suppliesService.lost(id);
  }
}
