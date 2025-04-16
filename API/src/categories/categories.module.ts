import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { MulterModule} from '@nestjs/platform-express';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schema/category.schema';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),

    MongooseModule.forFeature([{name: Category.name, schema: CategorySchema}])
  ],
  
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
