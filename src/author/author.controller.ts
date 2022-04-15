import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.types';
import { AuthorsService } from './author.service';
import { AuthorDTO } from './dto/author.dto';
import { Author } from './entities/author.entity';

@Controller('authors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuthorsController {
  constructor(private authorsService: AuthorsService) {}

  @Post()
  create(@Body() authorDto: AuthorDTO) {
    return this.authorsService.create(authorDto);
  }

  @Post('test')
  testCreate(@Res() res) {
    return res.redirect('/authors');
  }

  @Put(':id')
  @Roles(Role.Admin)
  update(@Param('id') id: Author['id'], @Body() authorDto: any) {
    return this.authorsService.update(id, authorDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  delete(@Param('id') id: Author['id']) {
    return this.authorsService.delete(id);
  }
}
