import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { Category } from 'src/categories/interfaces/category.interface';

@Injectable()
export class CategoriesRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async create(name: string): Promise<Category> {
        const result = await this.databaseService.executeQuery<Category>(
            `INSERT INTO Categories (name) OUTPUT INSERTED.* VALUES (@name)`,
            { name },
        );
        return result[0];
    }

    async findAll(): Promise<Category[]> {
        return await this.databaseService.executeQuery<Category>(`SELECT * FROM Categories`);;
    }

    async findById(id: number): Promise<Category | null> {
        const result = await this.databaseService.executeQuery<Category>(
            `SELECT * FROM Categories WHERE id = @Id`,
            { Id: id },
        );
        return result[0] || null;
    }

    async findByName(name: string): Promise<Category | null> {
        const result = await this.databaseService.executeQuery<Category>(
            `SELECT * FROM Categories WHERE name = @Name`,
            { Name: name },
        );
        return result[0] || null;
    }

    async update(id: number, name: string): Promise<Category> {
        const result = await this.databaseService.executeQuery<Category>(
            `UPDATE Categories SET name = @Name OUTPUT INSERTED.* WHERE id = @Id`,
            { Id: id, Name: name },
        );
        return result[0];
    }

    async delete(id: number): Promise<void> {
        await this.databaseService.executeQuery(
            `DELETE FROM Categories WHERE id = @Id`,
            { Id: id },
        );
    }
}