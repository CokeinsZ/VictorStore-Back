import { Review } from "src/reviews/interfaces/review.interface";
import { DatabaseService } from "../database.service";
import { CreateReviewDto } from "src/reviews/dtos/review.dto";


export class ReviewsRepository {
    constructor(private readonly db: DatabaseService) {}

    async createReview(review: CreateReviewDto): Promise<Review> {
        const query = `
            INSERT INTO Reviews (user_id, product_id, rating, comment)
            OUTPUT INSERTED.*
            VALUES (@UserId, @ProductId, @Rating, @Comment)
        `;
        const result = await this.db.executeQuery<Review>(query, { UserId: review.user_id, ProductId: review.product_id, Rating: review.rating, Comment: review.comment });
        return result[0];
    }

    async getSpecificReview(user_id: number, product_id: number): Promise<Review | null> {
        const query = `SELECT * FROM Reviews WHERE user_id = @UserId AND product_id = @ProductId`;
        const result = await this.db.executeQuery<Review>(query, { UserId: user_id, ProductId: product_id });
        return result[0] || null;
    }

    async getReviewsByProductId(product_id: number): Promise<Review[]> {
        const query = `SELECT * FROM Reviews WHERE product_id = @ProductId`;
        return this.db.executeQuery<Review>(query, { ProductId: product_id });
    }

    async getReviewsByUserId(user_id: number): Promise<Review[]> {
        const query = `SELECT * FROM Reviews WHERE user_id = @UserId`;
        return this.db.executeQuery<Review>(query, { UserId: user_id });
    }

    async updateProductRating(product_id: number, rating: number): Promise<void> {
        const query = `UPDATE Products SET rating = @Rating WHERE id = @ProductId`;
        await this.db.executeQuery(query, { ProductId: product_id, Rating: rating });
    }

    async deleteReview(user_id: number, product_id: number): Promise<void> {
        const query = `DELETE FROM Reviews WHERE user_id = @UserId AND product_id = @ProductId`;
        await this.db.executeQuery(query, { UserId: user_id, ProductId: product_id });
    }
}