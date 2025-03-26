import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import { In } from 'typeorm';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const roles = await this.rolesRepository.find({
      where: {
        id: In(createUserDto.roles.map((role) => role.id)),
      },
    });

    const newUser = this.usersRepository.create({
      ...createUserDto,
      roles,
    });

    return await this.usersRepository.save(newUser);
    //return await this.userRepository.save(createUserDto);
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOneByLogin(email: string): Promise<User> {
    const user = await this.usersRepository.findOneOrFail({
      where: { email },
      select: ['id', 'email', 'password'],
      relations: ['roles'],
    });

    return user;
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
    if (!user) {
      throw new NotFoundException();
    }
    await this.usersRepository.update(id, updateUserDto);
    return user;
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
