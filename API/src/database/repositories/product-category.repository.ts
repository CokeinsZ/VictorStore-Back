import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { Category, ProductCategory } from 'src/categories/interfaces/category.interface';
import { Product } from 'src/products/interfaces/product.interface';

@Injectable()
export class ProductCategoriesRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async asociateProductCategories(product_id: number, categories_id: number[]): Promise<ProductCategory[]> {
        let params = ``
        let values = {}
        for (const id in categories_id) {
            if (!categories_id[id]) {
                delete categories_id[id];
                continue;
            }

            params += `(@ProductId, @CategoryId${id}), `
            values[`CategoryId${id}`] = categories_id[id]
        }
        values['ProductId'] = product_id
        params = params.slice(0, -2) // Remove the last comma and space

        const query = `
            INSERT INTO Product_Category (product_id, category_id)
            OUTPUT inserted.*
            VALUES ${params}
        `
        const result = await this.databaseService.executeQuery<ProductCategory>(query, values);
        return result
    }

    async findByProductId(product_id: number): Promise<Category[]> {
        const query = `SELECT * FROM Categories AS C
            INNER JOIN Product_Category AS PC ON C.id = PC.category_id
            WHERE PC.product_id = @ProductId`;
        const result = await this.databaseService.executeQuery<Category>(query, { ProductId: product_id });
        return result || null;
    }

    async findByCategoryId(category_id: number): Promise<Product[]> {
        const query = `SELECT * FROM Products AS P
            INNER JOIN Product_Category AS PC ON P.id = PC.product_id
            WHERE PC.category_id = @CategoryId`;
        const result = await this.databaseService.executeQuery<Product>(query, { CategoryId: category_id });
        return result || null;
    }

    async update(product_id: number, categories_id: number[]): Promise<ProductCategory[]> {
        let params = ``
        let values = {}
        for (const id in categories_id) {
            if (!categories_id[id]) {
                delete categories_id[id];
                continue;
            }

            params += `(@ProductId, @CategoryId${id}), `
            values[`CategoryId${id}`] = categories_id[id]
        }
        values['ProductId'] = product_id
        params = params.slice(0, -2) // Remove the last comma and space

        const query = `
            DELETE FROM Product_Category WHERE product_id = @ProductId;
            INSERT INTO Product_Category (product_id, category_id) 
            OUTPUT inserted.*
            VALUES ${params}
        `
        const result = await this.databaseService.executeQuery<ProductCategory>(query, values);
        return result
    }
}