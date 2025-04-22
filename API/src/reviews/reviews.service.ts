import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { ReviewsRepository } from 'src/database/repositories/reviews.repository';import { Review } from './interfaces/review.interface';
import { CreateReviewDto } from './dtos/review.dto';

@Injectable()
export class ReviewsService {
    constructor(
        private readonly reviewsRepository: ReviewsRepository,
    ) {}

    async createReview(dto: CreateReviewDto): Promise<Review> {
        const existingReview = await this.reviewsRepository.getSpecificReview(dto.user_id, dto.product_id);
        if (existingReview) {
            throw new ConflictException('Review already exists for this user and product.');
        }

        if (dto.rating < 1 || dto.rating > 5) {
            throw new BadRequestException('Rating must be between 1 and 5.');
        }

        const review = await this.reviewsRepository.createReview(dto);
        await this.updateProductRating(dto.product_id);
        return review;        
    }

    async getReviewsByProductId(product_id: number): Promise<Review[]> {
        return await this.reviewsRepository.getReviewsByProductId(product_id);
    }

    async getReviewsByUserId(user_id: number): Promise<Review[]> {
        return await this.reviewsRepository.getReviewsByUserId(user_id);
    }

    async deleteReview(user_id: number, product_id: number): Promise<void> {
        await this.reviewsRepository.deleteReview(user_id, product_id);
    }

    async getSpecificReview(user_id: number, product_id: number): Promise<Review | null> {
        return await this.reviewsRepository.getSpecificReview(user_id, product_id);
    }

    async getAverageRating(product_id: number): Promise<number> {
        const reviews = await this.getReviewsByProductId(product_id);
        if (reviews.length === 0) {
            return 5; // No reviews, return 5 as average rating
        }
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return totalRating / reviews.length;
    }

    private async updateProductRating(product_id: number): Promise<void> {
        const averageRating = await this.getAverageRating(product_id);
        await this.reviewsRepository.updateProductRating(product_id, averageRating);
    }
    
}
