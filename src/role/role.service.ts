import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoleDto } from './dto/role.dto';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly rolesRepository: Repository<RoleEntity>,
  ) {}

  async list() {
    return await this.rolesRepository.find({ relations: ['users'] });
  }

  async create(roleDto: RoleDto) {
    const role = await this.rolesRepository.create(roleDto);

    return await this.rolesRepository.save(role);
  }

  async findByName(name: RoleEntity['name']) {
    const role = await this.rolesRepository.findOneBy({ name });

    if (!role) {
      return null;
    }

    return role;
  }

  async findById(id: RoleEntity['id']) {
    const role = await this.rolesRepository.findOneBy({ id });

    if (!role) {
      return null;
    }

    return role;
  }

  async delete(id: RoleEntity['id']) {
    return await this.rolesRepository.delete({ id });
  }
}
