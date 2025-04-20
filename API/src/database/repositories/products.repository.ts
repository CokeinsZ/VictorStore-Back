import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { Product } from 'src/products/interfaces/product.interface';

@Injectable()
export class ProductsRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async create(product: Partial<Product>): Promise<Product> {
        let fields = ``
        let params = ``
        let values = {}
        for (const key in product) {
            if (!product[key]) {
                delete product[key];
            }

            if (key === 'id') {}; // Skip id field in the insert

            fields += `${key}, `
            params += `@${key}, `
            values[key] = product[key]
        }
        fields = fields.slice(0, -2); // Remove the last comma and space

        const query = `
            INSERT INTO Products (${fields})
            OUTPUT INSERTED.*
            VALUES (${params})
        `;
        const result = await this.databaseService.executeQuery<Product>(query, values);

        return result[0];
    }

    async findAll(): Promise<Product[]> {
        const query = `SELECT * FROM Products`;
        return await this.databaseService.executeQuery<Product>(query);
    }

    async findById(id: number): Promise<Product | null> {
        const query = `SELECT * FROM Products WHERE id = @Id`;
        const result = await this.databaseService.executeQuery<Product>(query, { Id: id });
        return result[0] || null;
    }

    async findByName(name: string): Promise<Product[] | null> {
        const query = `SELECT * FROM Products WHERE name = @Name`;
        const result = await this.databaseService.executeQuery<Product[]>(query, { Name: name });
        return result[0] || null;
    }

    async findByCategoryId(categoryId: number): Promise<Product[]> {
        const query = `
            SELECT P.* FROM Products AS P 
            INNER JOIN Product_Category AS PC ON P.id = PC.product_id
            WHERE PC.category_id = @CategoryId OR P.main_category_id = @CategoryId
        `;
        return await this.databaseService.executeQuery<Product>(query, { CategoryId: categoryId });
    }

    async findByMainCategoryId(mainCategoryId: number): Promise<Product[]> {
        const query = `SELECT * FROM Products WHERE main_category_id = @MainCategoryId`;
        return await this.databaseService.executeQuery<Product>(query, { MainCategoryId: mainCategoryId });
    }

    async filterByPriceRange(min: number, max: number): Promise<Product[]> {
        const query = `SELECT * FROM Products WHERE price BETWEEN @Min AND @Max`;
        return await this.databaseService.executeQuery<Product>(query, { Min: min, Max: max });
    }

    async OrderByPriceAsc(): Promise<Product[]> {
        const query = `SELECT * FROM Products ORDER BY price ASC`;
        return await this.databaseService.executeQuery<Product>(query);
    }

    async OrderByPriceDesc(): Promise<Product[]> {
        const query = `SELECT * FROM Products ORDER BY price DESC`;
        return await this.databaseService.executeQuery<Product>(query);
    }

    async filterByRating(min: number, max: number): Promise<Product[]> {
        const query = `SELECT * FROM Products WHERE rating BETWEEN @Min AND @Max`;
        return await this.databaseService.executeQuery<Product>(query, { Min: min, Max: max });
    }

    async filterByDiscount(min: number, max: number): Promise<Product[]> {
        const query = `SELECT * FROM Products WHERE discount BETWEEN @Min AND @Max`;
        return await this.databaseService.executeQuery<Product>(query, { Min: min, Max: max });
    }

    async update(id: number, product: Partial<Product>): Promise<Product> {
        let params = ``
        let values = {}
        for (const key in product) {
            if (!product[key]) {
                delete product[key];
            }

            params += `${key} = @${key}, `
            values[key] = product[key]
        }
        params = params.slice(0, -2); // Remove the last comma and space
        values['Id'] = id // Add id to the values

        const query = `
            UPDATE Products SET ${params}
            OUTPUT INSERTED.*
            WHERE id = @Id
        `;
        const result = await this.databaseService.executeQuery<Product>(query, values);

        return result[0];
    }

    async delete(id: number): Promise<void> {
        const query = `DELETE FROM Products WHERE id = @Id`;
        await this.databaseService.executeQuery(query, { Id: id });
    }

}