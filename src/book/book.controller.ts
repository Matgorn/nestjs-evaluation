import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  SerializeOptions,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.types';
import { BooksService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book, GROUP_ALL_BOOKS, GROUP_BOOK } from './entities/book.entity';

@Controller('books')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class BooksController {
  constructor(private booksService: BooksService) {}
  @Get()
  @SerializeOptions({
    groups: [GROUP_ALL_BOOKS],
  })
  findAll() {
    return this.booksService.list();
  }

  @Get('info/:id')
  getBookInfoById(@Param('id') id: number) {
    return this.booksService.getBookInfoById(id);
  }

  @SerializeOptions({
    groups: [GROUP_BOOK],
  })
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
  @Roles(Role.Admin)
  updateBook(
    @Body() updateBookDto: UpdateBookDto,
    @Param('id') id: Book['id'],
  ) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  deleteBook(@Param('id') id: Book['id']) {
    return this.booksService.delete(id);
  }

  @Put('borrow/:id')
  borrowBook(@Param('id') id: Book['id'], @Req() req) {
    return this.booksService.borrowBook(id, req.user);
  }

  @Post('cover/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Roles(Role.Admin)
  async addCoverImage(
    @Param('id') id: Book['id'],
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.booksService.addCoverImage(id, file.buffer, file.originalname);
  }
}
