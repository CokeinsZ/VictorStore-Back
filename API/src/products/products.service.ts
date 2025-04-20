import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Product, ProductServiceInterface } from './interfaces/product.interface';
import { CreateProductDto, UpdateProductDto } from './dtos/product.dto';
import { ProductsRepository } from 'src/database/repositories/products.repository';

@Injectable()
export class ProductsService implements ProductServiceInterface {
    constructor(
        private readonly productsRepository: ProductsRepository,
    ) {
        this.fillCache().catch((error) => {
            console.error('Error filling product cache:', error);
        });
    }

    private productsCache: Map<number, Product> = new Map<number, Product>();

    private async fillCache() {
        const products = await this.productsRepository.findAll();
        for (const product of products) {
            this.productsCache.set(product.id, product);
        }
    }

    
    async create(product: CreateProductDto): Promise<Product> {
        const existingProduct = await this.productsRepository.findByName(product.name);
        if (existingProduct && existingProduct.length > 0) {
            throw new ConflictException(`Product with name ${product.name} already exists`);
        }

        const normaliced_product = {
            ...product,
            features: product.features? JSON.stringify(product.features) : null,
            specifications: product.specifications? JSON.stringify(product.specifications) : null,
            images: product.images || null,
        };

        const createdProduct = await this.productsRepository.create(normaliced_product);
        if (!createdProduct) {
            throw new InternalServerErrorException('Product creation failed');
        }

        this.productsCache.set(createdProduct.id, createdProduct); // Cache the created product

        return createdProduct;
    }

    async findAll(): Promise<Product[]> {
        return await this.productsRepository.findAll();
    }

    async findById(id: number): Promise<Product> {
        const cached_product = this.productsCache.get(id);
        if (cached_product) {
            return cached_product;
        }

        const product = await this.productsRepository.findById(id);
        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }
        return product;
    }

    async findByName(name: string): Promise<Product[]> {
        const product = await this.productsRepository.findByName(name);
        if (!product) {
            throw new NotFoundException(`Products with name ${name} not found`);
        }
        return product;
    }

    async findByCategoryId(categoryId: number): Promise<Product[]> {
        const products = await this.productsRepository.findByCategoryId(categoryId);
        if (!products || products.length === 0) {
            throw new NotFoundException(`No products found for category id ${categoryId}`);
        }
        return products;
    }

    async findByMainCategoryId(mainCategoryId: number): Promise<Product[]> {
        const products = await this.productsRepository.findByMainCategoryId(mainCategoryId);
        if (!products || products.length === 0) {
            throw new NotFoundException(`No products found for main category id ${mainCategoryId}`);
        }
        return products;
    }

    async filterByPriceRange(min: number, max: number): Promise<Product[]> {
        const products = await this.productsRepository.filterByPriceRange(min, max);
        if (!products || products.length === 0) {
            throw new NotFoundException(`No products found in the price range ${min} - ${max}`);
        }
        return products;
    }

    async OrderByPriceAsc(): Promise<Product[]> {
        const products = await this.productsRepository.OrderByPriceAsc();
        if (!products || products.length === 0) {
            throw new NotFoundException(`No products found`);
        }
        return products;
    }

    async OrderByPriceDesc(): Promise<Product[]> {
        const products = await this.productsRepository.OrderByPriceDesc();
        if (!products || products.length === 0) {
            throw new NotFoundException(`No products found`);
        }
        return products;
    }

    async filterByRating(min: number, max: number): Promise<Product[]> {
        const products = await this.productsRepository.filterByRating(min, max);
        if (!products || products.length === 0) {
            throw new NotFoundException(`No products found in the rating range ${min} - ${max}`);
        }
        return products;
    }

    async filterByDiscount(min: number, max: number): Promise<Product[]> {
        const products = await this.productsRepository.filterByDiscount(min, max);
        if (!products || products.length === 0) {
            throw new NotFoundException(`No products found in the discount range ${min} - ${max}`);
        }
        return products;
    }

    async update(id: number, product: UpdateProductDto): Promise<Product> {
        const existingProduct = await this.productsRepository.findById(id);
        if (!existingProduct) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }

        if (product.name) {
            const productWithSameName = await this.productsRepository.findByName(product.name);
            if (productWithSameName && productWithSameName.length > 0 && !productWithSameName.find(p => p.id === id)) {
                throw new ConflictException(`Product with name ${product.name} already exists`);
            }
        }

        const normaliced_product = {
            ...product,
            features: product.features? JSON.stringify(product.features) : null,
            specifications: product.specifications? JSON.stringify(product.specifications) : null,
            images: product.images || null,
        };

        const updatedProduct = await this.productsRepository.update(id, normaliced_product);
        if (!updatedProduct) {
            throw new InternalServerErrorException('Product update failed');
        }

        this.productsCache.set(updatedProduct.id, updatedProduct); // Update the cache

        return updatedProduct;
    }

    delete(id: number): Promise<void> {
        const cached_product = this.productsCache.get(id);
        if (cached_product) {
            this.productsCache.delete(id); // Remove from cache
        }
        return this.productsRepository.delete(id);
    }
    
}
