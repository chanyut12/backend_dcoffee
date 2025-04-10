import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { StockcheckRecord } from 'src/stockcheck-record/entities/stockcheck-record.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User, Role, StockcheckRecord])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
