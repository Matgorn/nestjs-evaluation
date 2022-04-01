import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from 'src/role/role.service';
import { Role } from 'src/role/role.types';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly rolesService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;
    let userRole = await this.rolesService.findByName(Role.User);

    if (!userRole) {
      userRole = await this.rolesService.create({ name: Role.User });
    }

    const user = await this.usersRepository.create({
      ...userData,
      roles: [userRole],
    });
    user.password = password;

    return this.usersRepository.save(user);
  }

  async findByEmail(email: User['email']) {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findById(id: User['id']) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {
        roles: true,
        books: {
          book: true,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, userDto: any) {
    const user = await this.findById(id);
    const foundRoles =
      (userDto?.roles &&
        (await Promise.all(
          userDto?.roles.map(
            async (roleName) => await this.rolesService.findByName(roleName),
          ),
        ))) ||
      [];

    return await this.usersRepository.save({
      ...user,
      ...userDto,
      roles: foundRoles,
    });
  }
}
