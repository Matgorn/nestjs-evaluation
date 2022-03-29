import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RoleDto } from './dto/role.dto';
import { RoleEntity } from './entities/role.entity';
import { RolesService } from './role.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async list() {
    return await this.rolesService.list();
  }

  @Post()
  async create(@Body() roleDto: RoleDto) {
    return await this.rolesService.create(roleDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: RoleEntity['id']) {
    return await this.rolesService.delete(id);
  }
}
