import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { RoleDto } from './dto/role.dto';
import { RoleEntity } from './entities/role.entity';
import { IRoleOptions } from './role.module';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly rolesRepository: Repository<RoleEntity>,
    @Inject('ROLE_OPTIONS') roleOptions: IRoleOptions,
  ) {
    console.log(roleOptions);
  }

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

  async findManyByNames(names: RoleEntity['name'][]) {
    return await this.rolesRepository.find({
      where: { name: In(names) },
    });
  }

  async findById(id: RoleEntity['id']) {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: { users: true },
    });

    if (!role) {
      return null;
    }

    return role;
  }

  async delete(id: RoleEntity['id']) {
    return await this.rolesRepository.delete({ id });
  }
}
