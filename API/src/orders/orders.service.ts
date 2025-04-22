import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Order, OrderItem, OrdersServiceInterface, OrderStatus } from './interfaces/order.interface';
import { CreateOrderDto, UpdateOrderDto } from './dtos/order.dto';
import { OrdersRepository } from 'src/database/repositories/orders.repository';
import { OrderItemRepository } from 'src/database/repositories/order-item.repository';
import { ProductsRepository } from 'src/database/repositories/products.repository';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class OrdersService implements OrdersServiceInterface {
    constructor(
        private readonly ordersRepository: OrdersRepository,
        private readonly orderItemRepository: OrderItemRepository,
        private readonly productsService: ProductsService
    ) { }

    async createOrder(dto: CreateOrderDto): Promise<Order> {
        const orderId = await this.ordersRepository.create(dto.userId);
        const orderItems = await this.orderItemRepository.create(orderId, dto.items as OrderItem[]);

        let total = 0;

        for (const item of orderItems) {
            const product = await this.productsService.findById(item.product_id);
            if (!product) {
                throw new NotFoundException(`Product with ID ${item.product_id} not found.`);
            }
            total += product.price * item.quantity;
        }

        await this.ordersRepository.updateOrderTotal(orderId, total);
        const order = await this.ordersRepository.findById(orderId); // Fetch the order again to include the total and the user details

        if (!order) {
            throw new BadRequestException(`A problem occurred while creating the order.`);
        }

        return {
            ...order,
            items: orderItems,
        };
    }

    async findAllOrders(): Promise<Order[]> {
        return await this.ordersRepository.findAll();
    }

    async findOrderById(id: number): Promise<Order> {
        const order = await this.ordersRepository.findById(id);
        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found.`);
        }
        const orderItems = await this.orderItemRepository.findByOrderId(id);

        if (!orderItems) {
            throw new NotFoundException(`Order items for order ID ${id} not found.`);
        }

        return {
            ...order,
            items: orderItems
        };
    }

    async findOrdersByUserId(userId: number): Promise<Order[]> {
        const orders = await this.ordersRepository.findByUserId(userId);
        if (!orders) {
            throw new NotFoundException(`Orders for user ID ${userId} not found.`);
        }

        for (const order of orders) {
            const orderItems = await this.orderItemRepository.findByOrderId(order.id);
            if (!orderItems) {
                throw new NotFoundException(`Order items for order ID ${order.id} not found.`);
            }
            order.items = orderItems;
        }
        return orders;
    }

    async findOrderItemsByStatus(order_id: number, status: OrderStatus): Promise<OrderItem[]> {
        const items = await this.orderItemRepository.findByOrderItemStatus(order_id, status);
        if (!items) {
            throw new NotFoundException(`Items with status ${status} not found for this order.`);
        }

        return items;
    }

    async findProductOrders(productId: number): Promise<Order[]> {
        return await this.ordersRepository.findProductOrders(productId);
    }

    async updateOrder(id: number, dto: UpdateOrderDto): Promise<Order> {
        const order = await this.findOrderById(id);
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        await this.orderItemRepository.updateOrderItems(id, dto.items as OrderItem[]);

        let total = 0;
        for (const item of dto.items as OrderItem[]) {
            const product = await this.productsService.findById(item.product_id);
            if (!product) {
                throw new NotFoundException(`Product with ID ${item.product_id} not found.`);
            }
            total += product.price * item.quantity;
        }
        await this.ordersRepository.updateOrderTotal(id, total);

        const result = await this.ordersRepository.findById(id);
        if (!result) {
            throw new NotFoundException(`Order with ID ${id} not found.`);
        }
        
        return {
            ...result,
            items: dto.items as OrderItem[],
            total
        };
    }

    async updateOrderItemStatus(order_id: number, product_id: number, status: OrderStatus): Promise<OrderItem> {
        return await this.orderItemRepository.updateOrderItemStatus(order_id, product_id, status);
    }

    async deleteOrder(id: number): Promise<void> {
        await this.ordersRepository.deleteOrder(id);
    }
}
