import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { AuthorsService } from './author.service';
import { AuthorDTO } from './dto/author.dto';
import { Author } from './entities/author.entity';

@Controller('authors')
export class AuthorsController {
  constructor(private authorsService: AuthorsService) {}

  @Post()
  create(@Body() authorDto: AuthorDTO) {
    return this.authorsService.create(authorDto);
  }

  @Put(':id')
  update(@Param('id') id: Author['id'], @Body() authorDto: any) {
    return this.authorsService.update(id, authorDto);
  }

  @Delete(':id')
  delete(@Param('id') id: Author['id']) {
    return this.authorsService.delete(id);
  }
}
