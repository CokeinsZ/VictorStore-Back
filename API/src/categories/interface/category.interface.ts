import { CreateCategoryDto, UpdateCategoryDto } from "../dto/category.dto";


export interface Category {
    _id?: string;          // MongoDB 
    id?: string;
    name: string;
    description: string;
    isActive: boolean;
    image: string;
}

export interface CategoryServiceInterface {
    create(createCategoryDto: CreateCategoryDto, file: Express.Multer.File): Promise<Category>;
    findAll(): Promise<Category[]>;
    findOne(id: string): Promise<Category>;
    update(id: string, updateCategoryDto: UpdateCategoryDto, file: Express.Multer.File): Promise<Category>;
    remove(id: string): Promise<void>;
}