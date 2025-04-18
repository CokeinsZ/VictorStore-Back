import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Category, CategoryServiceInterface } from './interfaces/category.interface';
import { CreateCategoryDto, UpdateCategoryDto } from './dtos/category.dto';
import { CategoriesRepository } from 'src/database/repositories/categories.repository';

@Injectable()
export class CategoriesService implements CategoryServiceInterface {
    constructor(
        private readonly categoriesRepository: CategoriesRepository,
    ) { }

    async create(category: CreateCategoryDto): Promise<Category> {
        const existingCategory = await this.categoriesRepository.findByName(category.name);
        if (existingCategory) {
            throw new ConflictException('Category already exists');
        }
        return this.categoriesRepository.create(category.name);
    }

    async findAll(): Promise<Category[]> {
        return this.categoriesRepository.findAll();
    }

    async findById(id: number): Promise<Category> {
        const category = await this.categoriesRepository.findById(id);
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        return category;
    }

    async findByName(name: string): Promise<Category> {
        const category = await this.categoriesRepository.findByName(name);
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        return category;
    }

    async update(id: number, category: UpdateCategoryDto): Promise<Category> {
        const existingCategory = await this.categoriesRepository.findById(id);
        if (!existingCategory) {
            throw new NotFoundException('Category not found');
        }

        const nameExists = await this.categoriesRepository.findByName(category.name);
        if (nameExists && nameExists.id !== id) {
            throw new ConflictException('Category name already exists');
        }

        return this.categoriesRepository.update(id, category.name);
    }

    delete(id: number): Promise<void> {
        return this.categoriesRepository.delete(id);
    }
}
