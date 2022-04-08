import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import { RoleEntity } from 'src/role/entities/role.entity';
import { RolesService } from 'src/role/role.service';
import { Role } from 'src/role/role.types';
import { Connection, In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly rolesService: RolesService,
    @Inject(forwardRef(() => MailService))
    private readonly mailService: MailService,
    private readonly connection: Connection,
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

    await this.usersRepository.save(user);
    await this.mailService.sendUserConfirmation(user);

    return user;
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

  async update(id: User['id'], userDto: UpdateUserDto) {
    const user = await this.findById(id);

    return await this.usersRepository.save({
      ...user,
      ...userDto,
    });
  }

  async updateRoles(id: User['id'], roles: string[]) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, { where: { id } });
      const foundRoles = await queryRunner.manager.find(RoleEntity, {
        where: { name: In(roles) },
      });

      const updatedUser = {
        ...user,
        roles: foundRoles,
      };

      return await queryRunner.manager.save(User, updatedUser);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async confirmEmailAdress(email: User['email']) {
    const user = await this.findByEmail(email);

    await this.usersRepository.save({
      ...user,
      isEmailConfirmed: true,
    });
  }
}
