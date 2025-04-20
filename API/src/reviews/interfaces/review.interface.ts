import { CreateReviewDto } from "../dtos/review.dto";

export interface Review {
    user_id: number;
    product_id: number;
    rating: number;
    comment: string;
}

export interface ReviewsServiceInterface {
    createReview(review: CreateReviewDto): Promise<Review>;
    getReviewsByProductId(product_id: number): Promise<Review[]>;
    getReviewsByUserId(user_id: number): Promise<Review[]>;
    deleteReview(review_id: number): Promise<void>;
}
