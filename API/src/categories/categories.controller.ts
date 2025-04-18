import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CheckPolicies } from 'src/tools/decorators/check-policies.decorator';
import { Action } from 'src/tools/abilities/ability.factory';
import { Category } from './interfaces/category.interface';
import { CreateCategoryDto, UpdateCategoryDto } from './dtos/category.dto';
import { Public } from 'src/tools/decorators/public.decorator';

@Controller('categories')
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService,
    ) {}

    @CheckPolicies({ action: Action.Create, subject: 'Category' })
    @Post()
    async create(@Body() createDto: CreateCategoryDto): Promise<Category> {
        return this.categoriesService.create(createDto);
    }

    @Public()
    @Get()
    async findAll(): Promise<Category[]> {
        return this.categoriesService.findAll();
    }

    @Public()
    @Get(':id')
    async findById(@Param('id') id: number): Promise<Category> {
        return this.categoriesService.findById(id);
    }

    @Public()
    @Get('name/:name')
    async findByName(@Param('name') name: string): Promise<Category> {
        return this.categoriesService.findByName(name);
    }

    @CheckPolicies({ action: Action.Update, subject: 'Category' })
    @Put(':id')
    async update(@Param('id') id: number, @Body() updateDto: UpdateCategoryDto): Promise<Category> {
        return this.categoriesService.update(id, updateDto);
    }

    @CheckPolicies({ action: Action.Delete, subject: 'Category' })
    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
        return this.categoriesService.delete(id);
    }
}
