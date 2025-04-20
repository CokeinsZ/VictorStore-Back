import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { RepositoriesModule } from 'src/database/repositories/repositories.module';

@Module({
  imports: [RepositoriesModule],
  providers: [ReviewsService],
  controllers: [ReviewsController]
})
export class ReviewsModule {}
