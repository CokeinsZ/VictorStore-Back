import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ProductsModule } from 'src/products/products.module';
import { RepositoriesModule } from 'src/database/repositories/repositories.module';

@Module({
  imports: [ProductsModule, RepositoriesModule],
  providers: [OrdersService],
  controllers: [OrdersController]
})
export class OrdersModule {}
