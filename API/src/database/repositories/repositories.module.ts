import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { VerificatoinCodesRepository } from './verification-codes.repository';
import { DatabaseModule } from 'src/database/database.module';
import { CategoriesRepository } from './categories.repository';
import { ProductsRepository } from './products.repository';
import { OrdersRepository } from './orders.repository';
import { OrderItemRepository } from './order-item.repository';
import { ReviewsRepository } from './reviews.repository';
import { ProductCategoriesRepository } from './product-category.repository';

@Module({
    imports: [DatabaseModule],
    providers: [UsersRepository, VerificatoinCodesRepository, CategoriesRepository, ProductCategoriesRepository, ProductsRepository, OrdersRepository, OrderItemRepository, ReviewsRepository],
    exports: [UsersRepository, VerificatoinCodesRepository, CategoriesRepository, ProductCategoriesRepository, ProductsRepository, OrdersRepository, OrderItemRepository, ReviewsRepository],
})
export class RepositoriesModule {}
