import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Action } from 'src/tools/abilities/ability.factory';
import { CheckPolicies } from 'src/tools/decorators/check-policies.decorator';
import { Public } from 'src/tools/decorators/public.decorator';
import { Roles } from 'src/tools/decorators/roles.decorator';
import { user_role } from 'src/users/interfaces/user.interface';
import { Review } from './interfaces/review.interface';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dtos/review.dto';

@Controller('vs/api/v1/reviews')
export class ReviewsController {

    constructor(
        private readonly reviewsService: ReviewsService
    ) {}

    @Post()
    @Roles(user_role.USER)
    async createReview(@Body() dto: CreateReviewDto): Promise<Review> {
        return await this.reviewsService.createReview(dto);
    }

    @Get(':product_id')
    @Public()
    async getReviewsByProductId(@Param('product_id') product_id: number): Promise<Review[]> {
        return await this.reviewsService.getReviewsByProductId(product_id);
    }

    @Get('user/:user_id')
    @CheckPolicies({ action: Action.Read, subject: 'Review' })
    async getReviewsByUserId(@Param('user_id') user_id: number): Promise<Review[]> {
        return await this.reviewsService.getReviewsByUserId(user_id);
    }

    @Get('specific/:user_id/:product_id')
    @CheckPolicies({ action: Action.Read, subject: 'Review' })
    async getSpecificReview(@Param('user_id') user_id: number, @Param('product_id') product_id: number): Promise<Review | null> {
        return await this.reviewsService.getSpecificReview(user_id, product_id);
    }

    @Delete(':user_id/:product_id')
    @CheckPolicies({ action: Action.Delete, subject: 'Review' })
    async deleteReview(@Param('user_id') user_id: number, @Param('product_id') product_id: number): Promise<void> {
        return await this.reviewsService.deleteReview(user_id, product_id);
    }
}
