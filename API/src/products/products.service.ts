import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Model } from 'mongoose';
import { CreateProductDto, UpdateProductDto } from './dtos/product.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { Product as ProductInterface, ProductsServiceInterface } from './interface/product.interface';
import { Category } from 'src/categories/interface/category.interface';

@Injectable()
export class ProductsService implements ProductsServiceInterface {
    constructor(
        @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
        private readonly categoriesService: CategoriesService,
    ) { }

    private toProductInterface(product: any, categoryName: string): ProductInterface {
        return {
            id: product._id,
            name: product.name,
            description: product.description,
            category: categoryName,
            price: product.price,
            isActive: product.isActive,
            createdBy: product.createdBy,
        };
    }

    async findAll(userId?: string): Promise<ProductInterface[]> {
        const query = userId ? { createdBy: userId } : {};
        const products = await this.productModel.find(query).exec();
        
        const productInterfaces = await Promise.all(products.map(async (product) => {
            const category = await this.categoriesService.findOne(product.category);
            return this.toProductInterface(product, category.name);
        }));
        return productInterfaces;
    }

    async findById(id: string): Promise<ProductInterface> {
        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        const category = await this.categoriesService.findOne(product.category);
        return this.toProductInterface(product, category.name);
    }

    async create(createProductDto: CreateProductDto, userId: string): Promise<ProductInterface> {
        const existingCategory = await this.categoriesService.findByName(createProductDto.category);
        if (!existingCategory) {
            throw new NotFoundException(`Category with Name ${createProductDto.category} not found`);
        }

        const newProduct = new this.productModel({
            ...createProductDto,
            category: existingCategory._id,
            createdBy: userId,
        });

        const savedProduct = await newProduct.save();
        return this.toProductInterface(savedProduct, existingCategory.name);
    }

    async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductInterface> {
        
        let existingCategory: Category;
        let updatedProduct: any = null;

        if (updateProductDto.category) {
            existingCategory = await this.categoriesService.findByName(updateProductDto.category);
            if (!existingCategory) {
                throw new NotFoundException(`Category with Name ${updateProductDto.category} not found`);
            }

            updatedProduct = await this.productModel
            .findByIdAndUpdate(id, 
                {
                    ...updateProductDto,
                    category: existingCategory.id,
                }, 
                { new: true })
            .exec();

        } else {
            updatedProduct = await this.productModel
            .findByIdAndUpdate(id, 
                { updateProductDto },
                { new: true })
            .exec();
        }

        
        if (!updatedProduct) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        return this.toProductInterface(updatedProduct, updatedProduct.category);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.productModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return true;
    }
}
