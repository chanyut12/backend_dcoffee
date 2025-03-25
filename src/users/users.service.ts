import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  lastId: number = 1;
  users: User[] = [
    {
      id: 1,
      login: 'admin',
      password: 'pass@1234',
      roles: ['admin'],
      gender: 'male',
      age: 50,
    },
  ];
  create(createUserDto: CreateUserDto) {
    this.lastId++;
    const newUser = { ...createUserDto, id: this.lastId };
    this.users.push(newUser);
    return newUser;
  }

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index < 0) {
      throw new NotFoundException();
    }
    return this.users[index];
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index < 0) {
      throw new NotFoundException();
    }
    this.users[index] = { ...this.users[index], ...updateUserDto };
    return this.users[index];
  }

  remove(id: number) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index < 0) {
      throw new NotFoundException();
    }
    const delUser = this.users[index];
    this.users.splice(index, 1);
    return delUser;
  }
}
