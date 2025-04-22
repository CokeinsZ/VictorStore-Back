import { CreateOrderDto, UpdateOrderDto } from "../dtos/order.dto";

export enum OrderStatus {
    NOT_PROCESSED = 'not processed',
    PENDING = 'pending',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    RETURNED = 'returned',
    REFUNDED = 'refunded',
    CANCELLED = 'cancelled'
}

export interface Order {
    id: number;

    user_id: number;
    nick_name: string;
    email: string;
    
    total?: number;

    items?: OrderItem[];

    created_at: Date;
    updated_at: Date;
}

export interface OrderItem {
    order_id?: number;
    product_id: number;
    quantity: number;
    status: OrderStatus;
    created_at: Date;
    updated_at: Date;

}

export interface OrdersServiceInterface {
    createOrder(dto: CreateOrderDto): Promise<Order>;
    findAllOrders(): Promise<Order[]>;
    findOrderById(id: number): Promise<Order>;
    findOrdersByUserId(userId: number): Promise<Order[]>;
    findOrderItemsByStatus(order_id:number, status: OrderStatus): Promise<OrderItem[]>;
    findProductOrders(productId: number): Promise<Order[]>;
    updateOrder(id: number, dto: UpdateOrderDto): Promise<Order>;
    updateOrderItemStatus(order_id: number, product_id: number, status: OrderStatus): Promise<OrderItem> 
    deleteOrder(id: number): Promise<void>;
}