import { IsArray, IsJSON, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    price: number;

    @IsNumber()
    @IsOptional()
    discount?: number = 0;

    @IsJSON()
    @IsOptional()
    features?: Record<string, any>;

    @IsJSON()
    @IsOptional()
    specifications?: Record<string, any>;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    images?: string[];

    @IsNotEmpty()
    @IsNumber()
    main_category_id: number;

    @IsArray()
    @IsOptional()
    categories?: number[];
}

export class UpdateProductDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    price?: number;

    @IsNumber()
    @IsOptional()
    discount?: number = 0;

    @IsJSON()
    @IsOptional()
    features?: Record<string, any>;

    @IsJSON()
    @IsOptional()
    specifications?: Record<string, any>;

    @IsArray()
    @IsOptional()
    images?: string[];

    @IsNumber()
    @IsOptional()
    main_category_id?: number;

    @IsArray()
    @IsOptional()
    categories?: number[];
}