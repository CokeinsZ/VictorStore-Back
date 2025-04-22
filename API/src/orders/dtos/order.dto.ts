import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, ValidateNested } from "class-validator";
import { Order, OrderStatus } from "../interfaces/order.interface";

export class OrderItemDto {
    @IsNotEmpty()
    @IsNumber()
    product_id: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}

export class CreateOrderDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    @IsArray()
    items: OrderItemDto[];
}

export class UpdateOrderDto {
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    @IsArray()
    items: OrderItemDto[];
}

export class UpdateOrderItemStatusDto {
    @IsNotEmpty()
    @IsNumber()
    order_id: number;

    @IsNotEmpty()
    @IsNumber()
    product_id: number;

    @IsNotEmpty()
    @IsEnum(OrderStatus)
    status: OrderStatus;
}
