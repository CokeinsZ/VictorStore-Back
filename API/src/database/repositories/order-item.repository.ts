import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { OrderItem } from 'src/orders/interfaces/order.interface';

@Injectable()
export class OrderItemRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async create(orderId: number, items: OrderItem[]): Promise<OrderItem[]> {
        console.log('Creating order items:', items);//DEBUG
        let params = ``
        let values = {}
        for (const item of items) {
            params += `(@OrderId, @ProductId${item.product_id}, @Quantity${item.product_id}), `
            values[`ProductId${item.product_id}`] = item.product_id
            values[`Quantity${item.product_id}`] = item.quantity
        }        
        params = params.slice(0, -2); // Remove the last comma and space
        values['OrderId'] = orderId

        const query = `
            INSERT INTO Order_Items (order_id, product_id, quantity)
            OUTPUT INSERTED.*
            VALUES ${params}
        `;

        return await this.databaseService.executeQuery<OrderItem>(query, values);
    }

    async findByOrderId(orderId: number): Promise<OrderItem[]> {
        const query = `SELECT * FROM Order_Items WHERE order_id = @OrderId`;
        return await this.databaseService.executeQuery<OrderItem>(query, { OrderId: orderId });
    }

    async findByOrderItemStatus(order_id: number, status: string): Promise<OrderItem[]> {
        const query = `SELECT * FROM Order_Items WHERE order_id = @OrderId AND status = @Status`;
        return await this.databaseService.executeQuery<OrderItem>(query, { OrderId: order_id, Status: status });
    }

    async updateOrderItems(orderId: number, items: OrderItem[]): Promise<OrderItem[]> {
        const query = `
            DELETE FROM Order_Items WHERE order_id = @OrderId;
            INSERT INTO Order_Items (order_id, product_id, quantity)
            OUTPUT INSERTED.*
            VALUES ${items.map((item, index) => `(@OrderId, @ProductId${index}, @Quantity${index})`).join(', ')}
        `;

        const values = items.reduce((acc, item, index) => {
            acc[`ProductId${index}`] = item.product_id;
            acc[`Quantity${index}`] = item.quantity;
            return acc;
        }, { OrderId: orderId });

        const result = await this.databaseService.executeQuery<OrderItem>(query, values);
        return result;
    }

    async updateOrderItemStatus(orderId: number, product_id: number, status: string): Promise<OrderItem> {
        const query = `
            UPDATE Order_Items
            SET status = @Status
            OUTPUT INSERTED.*
            WHERE order_id = @OrderId AND product_id = @ProductId
        `;
        const result = await this.databaseService.executeQuery<OrderItem>(query, { OrderId: orderId, ProductId: product_id, Status: status });
        return result[0];
        
    }


}