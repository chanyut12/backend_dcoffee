import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Role } from './roles/entities/role.entity';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { SalariesModule } from './salaries/salaries.module';
import { Salary } from './salaries/entities/salary.entity';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/entities/category.entity';
import { TypesModule } from './types/types.module';
import { Type } from './types/entities/type.entity';
import { InventoryItemsModule } from './inventory-items/inventory-items.module';
import { InventoryItem } from './inventory-items/entities/inventory-item.entity';
import { StockcheckRecordModule } from './stockcheck-record/stockcheck-record.module';
import { StockcheckDetailModule } from './stockcheck-detail/stockcheck-detail.module';
import { StockcheckDetail } from './stockcheck-detail/entities/stockcheck-detail.entity';
import { OrderDetailModule } from './order-detail/order-detail.module';
import { OrderDetail } from './order-detail/entities/order-detail.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entities/product.entity';
import { OrderRecordModule } from './order-record/order-record.module';
import { StockcheckRecord } from './stockcheck-record/entities/stockcheck-record.entity';
import { CartItemModule } from './cart-item/cart-item.module';
import { CartItem } from './cart-item/entities/cart-item.entity';
import { OrderRecord } from './order-record/entities/order-record.entity';
import { UsageDetailModule } from './usage-detail/usage-detail.module';
import { UsageRecordModule } from './usage-record/usage-record.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads/products'),
      serveRoot: '/product-images',
    }),
    UsersModule,
    RolesModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [
        User,
        Role,
        Salary,
        Category,
        Type,
        InventoryItem,
        StockcheckDetail,
        StockcheckRecord,
        OrderDetail,
        Product,
        OrderRecord,
        CartItem,
      ],
      synchronize: true,
    }),
    AuthModule,
    SalariesModule,
    CategoriesModule,
    TypesModule,
    InventoryItemsModule,
    StockcheckRecordModule,
    StockcheckDetailModule,
    OrderDetailModule,
    ProductsModule,
    OrderRecordModule,
    CartItemModule,
    UsageDetailModule,
    UsageRecordModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
