import { CreateCategoryDto, UpdateCategoryDto } from "../dtos/category.dto";

export interface Category {
    id: number;
    name: string;
}

export interface CategoryServiceInterface {
    create(category: CreateCategoryDto): Promise<Category>;
    findAll(): Promise<Category[]>;
    findById(id: number): Promise<Category>;
    findByName(name: string): Promise<Category>;
    update(id: number, category: UpdateCategoryDto): Promise<Category>;
    delete(id: number): Promise<void>;
}