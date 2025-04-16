import { CreateProductDto, UpdateProductDto } from "../dtos/product.dto";


export interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    isActive: boolean;
    createdBy: string;
}

export interface ProductsServiceInterface {
    findAll(userId?: string): Promise<Product[]>;
    findById(id: string): Promise<Product>;
    create(createProductDto: CreateProductDto, userId: string): Promise<Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<Product>;
    delete(id: string): Promise<boolean>;
}