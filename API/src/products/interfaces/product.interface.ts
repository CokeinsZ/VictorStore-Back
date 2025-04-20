import { CreateProductDto, UpdateProductDto } from "../dtos/product.dto";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    discount: number;
    rating: number;
    features: Record<string, any> | string | null;
    specifications: Record<string, any> | string | null;
    images: string[] | null;
    main_category_id: number | null;
}

export interface ProductServiceInterface {
    create(product: CreateProductDto): Promise<Product>;

    findAll(): Promise<Product[]>;
    findById(id: number): Promise<Product>;
    findByName(name: string): Promise<Product[]>;
    findByCategoryId(categoryId: number): Promise<Product[]>;
    findByMainCategoryId(mainCategoryId: number): Promise<Product[]>;

    filterByPriceRange(min: number, max: number): Promise<Product[]>;
    OrderByPriceAsc(): Promise<Product[]>;
    OrderByPriceDesc(): Promise<Product[]>;
    filterByRating(min: number, max: number): Promise<Product[]>;
    filterByDiscount(min: number, max: number): Promise<Product[]>;

    update(id: number, product: UpdateProductDto): Promise<Product>;
    delete(id: number): Promise<void>;
}
