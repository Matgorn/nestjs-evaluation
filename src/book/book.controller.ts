import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.types';
import { BooksService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.Admin)
  find() {
    return this.booksService.list();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.booksService.findById(id);
  }

  @Post()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  createBook(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Put(':id')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  updateBook(
    @Body() updateBookDto: UpdateBookDto,
    @Param('id') id: Book['id'],
  ) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  deleteBook(@Param('id') id: Book['id']) {
    return this.booksService.delete(id);
  }
}
