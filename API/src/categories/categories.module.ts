import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { RepositoriesModule } from 'src/database/repositories/repositories.module';

@Module({
  imports: [RepositoriesModule],
  providers: [CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoriesService]
})
export class CategoriesModule {}
