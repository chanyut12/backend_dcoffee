/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, NotFoundException } from '@nestjs/common';
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
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}
  lastId: number = 1;
  async create(createUserDto: CreateUserDto) {
    const roles = await this.roleRepository.find({
      where: {
        id: In(createUserDto.roles.map((role) => role.id)),
      },
    });

    const newUser = this.userRepository.create({
      ...createUserDto,
      roles,
      id: this.lastId++,
    });

    return await this.userRepository.save(newUser);
    //return await this.userRepository.save(createUserDto);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }
    await this.userRepository.update(id, updateUserDto);
    return user;
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
