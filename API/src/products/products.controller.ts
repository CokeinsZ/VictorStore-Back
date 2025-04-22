import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dtos/product.dto';
import { CheckPolicies } from 'src/tools/decorators/check-policies.decorator';
import { Action } from 'src/tools/abilities/ability.factory';
import { Public } from 'src/tools/decorators/public.decorator';

@Controller('vs/api/v1/products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService
    ) {}

    @Post()
    @CheckPolicies({ action: Action.Create, subject: 'Product' })
    async createProduct(@Body() product: CreateProductDto): Promise<any> {
        return await this.productsService.create(product);
    }

    @Get()
    @Public()
    async getAllProducts(): Promise<any> {
        return await this.productsService.findAll();
    }

    @Get(':id')
    @Public()
    async getProductById(@Param('id') id: number): Promise<any> {
        return await this.productsService.findById(id);
    }

    @Get('name/:name')
    @Public()
    async getProductByName(@Param('name') name: string): Promise<any> {
        const normaliced_name = name
            .replace(/^['"]+|['"]+$/g, '')
            .trim();
        return await this.productsService.findByName(normaliced_name);
    }

    @Get('category/:categoryId')
    @Public()
    async getProductsByCategoryId(@Param('categoryId') categoryId: number): Promise<any> {
        return await this.productsService.findByCategoryId(categoryId);
    }

    @Get('main-category/:mainCategoryId')
    @Public()
    async getProductsByMainCategoryId(@Param('mainCategoryId') mainCategoryId: number): Promise<any> {
        return await this.productsService.findByMainCategoryId(mainCategoryId);
    }

    @Get('price-range/:min/:max')
    @Public()
    async getProductsByPriceRange(@Param('min') min: number, @Param('max') max: number): Promise<any> {
        return await this.productsService.filterByPriceRange(min, max);
    }

    @Get('order/price/asc')
    @Public()
    async getProductsOrderByPriceAsc(): Promise<any> {
        return await this.productsService.OrderByPriceAsc();
    }

    @Get('order/price/desc')
    @Public()
    async getProductsOrderByPriceDesc(): Promise<any> {
        return await this.productsService.OrderByPriceDesc();
    }

    @Get('rating-range/:min/:max')
    @Public()
    async getProductsByRatingRange(@Param('min') min: number, @Param('max') max: number): Promise<any> {
        return await this.productsService.filterByRating(min, max);
    }

    @Get('discount-range/:min/:max')
    @Public()
    async getProductsByDiscountRange(@Param('min') min: number, @Param('max') max: number): Promise<any> {
        return await this.productsService.filterByDiscount(min, max);
    }

    @Patch(':id')
    @CheckPolicies({ action: Action.Update, subject: 'Product' })
    async updateProduct(@Param('id') id: number, @Body() product: UpdateProductDto): Promise<any> {
        return await this.productsService.update(id, product);
    }

    @Delete(':id')
    @CheckPolicies({ action: Action.Delete, subject: 'Product' })
    async deleteProduct(@Param('id') id: number): Promise<any> {
        return await this.productsService.delete(id);
    }

}
