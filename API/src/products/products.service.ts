import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Product, ProductServiceInterface } from './interfaces/product.interface';
import { CreateProductDto, UpdateProductDto } from './dtos/product.dto';
import { ProductsRepository } from 'src/database/repositories/products.repository';
import { ProductCategoriesRepository } from 'src/database/repositories/product-category.repository';
import { CategoriesRepository } from 'src/database/repositories/categories.repository';

@Injectable()
export class ProductsService implements ProductServiceInterface, OnModuleInit {
    constructor(
        private readonly productsRepository: ProductsRepository,
        private readonly categoriesRepository: CategoriesRepository,
        private readonly productCategoriesRepository: ProductCategoriesRepository,
    ) {}

    private productsCache: Map<number, Product> = new Map<number, Product>();

    // Se invoca tras onModuleInit de todos los providers, incluido DatabaseService
    async onModuleInit() {
        try {
            await this.fillCache();
            console.log('Product cache initialized');
        } catch (error) {
            console.error('Error filling product cache:', error);
        }
    }

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

        if (product.categories && product.categories.length > 0) {
            const categories = await this.categoriesRepository.findByIdsArray([...product.categories, product.main_category_id]);
            if (categories.length !== product.categories.length + 1) {
                throw new NotFoundException(`Some categories not found`);
            }
        }

        const normaliced_product = {
            ...product,
            features: product.features? JSON.stringify(product.features) : null,
            specifications: product.specifications? JSON.stringify(product.specifications) : null,
            images: product.images ? JSON.stringify(product.images) : null,  // <— stringificar aquí
            categories: null
        };

        const createdProduct = await this.productsRepository.create(normaliced_product);
        if (!createdProduct) {
            throw new InternalServerErrorException('Product creation failed');
        }

        this.productsCache.set(createdProduct.id, createdProduct); // Cache the created product

        // Associate categories if provided
        if (product.categories && product.categories.length > 0) {
            await this.productCategoriesRepository.asociateProductCategories(createdProduct.id, product.categories);
        }

        return createdProduct;
    }

    async findAll(): Promise<Product[]> {
        const products = await this.productsRepository.findAll();
        const updatedProducts = await Promise.all(products.map(async product => {
            product.categories = await this.productCategoriesRepository.findByProductId(product.id);
            this.productsCache.set(product.id, product); // Cache each product
            return product;
        }));

        return updatedProducts;
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

        product.categories = await this.productCategoriesRepository.findByProductId(product.id);
        this.productsCache.set(product.id, product); // Cache the product
        return product;
    }

    async findByName(name: string): Promise<Product[]> {
        const products = await this.productsRepository.findByName(name);
        if (!products || products.length === 0) {
            throw new NotFoundException(`Products with name ${name} not found`);
        }
        const updatedProducts = await Promise.all(products.map(async product => {
            product.categories = await this.productCategoriesRepository.findByProductId(product.id);
            return product;
        }));

        return updatedProducts;
    }

    async findByCategoryId(categoryId: number): Promise<Product[]> {
        const products = await this.productsRepository.findByCategoryId(categoryId);
        if (!products || products.length === 0) {
            throw new NotFoundException(`No products found for category id ${categoryId}`);
        }
        const updatedProducts = await Promise.all(products.map(async product => {
            product.categories = await this.productCategoriesRepository.findByProductId(product.id);
            return product;
        }));
        return updatedProducts;
    }

    async findByMainCategoryId(mainCategoryId: number): Promise<Product[]> {
        const products = await this.productsRepository.findByMainCategoryId(mainCategoryId);
        if (!products || products.length === 0) {
            throw new NotFoundException(`No products found for main category id ${mainCategoryId}`);
        }
        const updatedProducts = await Promise.all(products.map(async product => {
            product.categories = await this.productCategoriesRepository.findByProductId(product.id);
            return product;
        }));
        return updatedProducts;
    }

    async filterByPriceRange(min: number, max: number): Promise<Product[]> {
        const products = await this.productsRepository.filterByPriceRange(min, max);
        if (!products || products.length === 0) {
            throw new NotFoundException(`No products found in the price range ${min} - ${max}`);
        }
        const updatedProducts = await Promise.all(products.map(async product => {
            product.categories = await this.productCategoriesRepository.findByProductId(product.id);
            return product;
        }));
        return updatedProducts;
    }

    async OrderByPriceAsc(): Promise<Product[]> {
        const products = await this.productsRepository.OrderByPriceAsc();
        if (!products || products.length === 0) {
            throw new NotFoundException(`No products found`);
        }
        const updatedProducts = await Promise.all(products.map(async product => {
            product.categories = await this.productCategoriesRepository.findByProductId(product.id);
            return product;
        }));
        return updatedProducts;
    }

    async OrderByPriceDesc(): Promise<Product[]> {
        const products = await this.productsRepository.OrderByPriceDesc();
        if (!products || products.length === 0) {
            throw new NotFoundException(`No products found`);
        }
        const updatedProducts = await Promise.all(products.map(async product => {
            product.categories = await this.productCategoriesRepository.findByProductId(product.id);
            return product;
        }));
        return updatedProducts;
    }

    async filterByRating(min: number, max: number): Promise<Product[]> {
        const products = await this.productsRepository.filterByRating(min, max);
        if (!products || products.length === 0) {
            throw new NotFoundException(`No products found in the rating range ${min} - ${max}`);
        }
        const updatedProducts = await Promise.all(products.map(async product => {
            product.categories = await this.productCategoriesRepository.findByProductId(product.id);
            return product;
        }));
        return updatedProducts;
    }

    async filterByDiscount(min: number, max: number): Promise<Product[]> {
        const products = await this.productsRepository.filterByDiscount(min, max);
        if (!products || products.length === 0) {
            throw new NotFoundException(`No products found in the discount range ${min} - ${max}`);
        }
        const updatedProducts = await Promise.all(products.map(async product => {
            product.categories = await this.productCategoriesRepository.findByProductId(product.id);
            return product;
        }));
        return updatedProducts;
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
            images: product.images ? JSON.stringify(product.images) : null,  // <— stringificar aquí
            categories: null
        };

        const updatedProduct = await this.productsRepository.update(id, normaliced_product);
        if (!updatedProduct) {
            throw new InternalServerErrorException('Product update failed');
        }

        // Update categories if provided
        if (product.categories && product.categories.length > 0) {
            await this.productCategoriesRepository.update(id, product.categories);
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
