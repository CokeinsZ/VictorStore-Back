import { Injectable, NotFoundException } from '@nestjs/common';
import { Category, CategoryServiceInterface } from './interface/category.interface';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category as CategoryModel } from './schema/category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoriesService implements CategoryServiceInterface {
    constructor(@InjectModel(CategoryModel.name) private categoryModel: Model<CategoryModel>) {}

    private toCategoryInterface(category: any): Category {
        const categoryObj = category.toObject();
        categoryObj.id = categoryObj._id.toString();
        delete categoryObj.__v;
        return categoryObj as Category;
    }

    private encodeImage(file: Express.Multer.File): string {
        if (!file) {
            throw new Error('File is missing');
        }
    
        if (!file.buffer || !(file.buffer instanceof Buffer)) {
            console.error('Invalid file buffer:', file);
            throw new Error('File buffer is missing or invalid');
        }
    
        return file.buffer.toString('base64');
    }

    async create(createCategoryDto: CreateCategoryDto, file: Express.Multer.File): Promise<Category> {
        const existingCategory = await this.categoryModel.findOne({ name: createCategoryDto.name });
        if (existingCategory) {
            throw new Error('Category already exists');
        }

        const image = this.encodeImage(file);
        const newCategory = new this.categoryModel({
            ...createCategoryDto,
            image
        });
        const savedCategory = await newCategory.save();


        return this.toCategoryInterface(savedCategory);
    }

    async findByName(name: string): Promise<Category> {
        const category = await this.categoryModel.findOne({ name }).exec();
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        
        return this.toCategoryInterface(category);
    }

    async findAll(): Promise<Category[]> {
        const categories = await this.categoryModel.find().exec();
        return categories.map((category) => this.toCategoryInterface(category));
    }

    async findOne(id: string): Promise<Category> {
        const category = await this.categoryModel.findById(id).exec();
        if (!category) {
            throw new NotFoundException('Category not found');
        }

        return this.toCategoryInterface(category);
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto, file: Express.Multer.File): Promise<Category> {
        const existingCategory = await this.categoryModel.findById(id).exec();
        if (!existingCategory) {
            throw new NotFoundException('Category not found');
        }

        if (file) {
            updateCategoryDto.image = this.encodeImage(file);
        }

        const updatedCategory = await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true }).exec();
        return this.toCategoryInterface(updatedCategory);
    }

    async remove(id: string): Promise<void> {
        const deletedCategory = await this.categoryModel.findByIdAndDelete(id).exec();
        if (!deletedCategory) {
            throw new NotFoundException('Category not found');
        }
    }


}
