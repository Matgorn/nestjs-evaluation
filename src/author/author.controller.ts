import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthorsService } from './author.service';
import { AuthorDTO } from './dto/author.dto';

@Controller('authors')
export class AuthorsController {
  constructor(private authorsService: AuthorsService) {}

  @Get()
  find() {
    return this.authorsService.find();
  }

  @Post()
  create(@Body() authorDto: AuthorDTO) {
    return this.authorsService.create(authorDto);
  }
}
