import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { Order, OrderItem, OrderStatus } from 'src/orders/interfaces/order.interface';

@Injectable()
export class OrdersRepository {
    constructor(private readonly databaseService: DatabaseService) { }

    async create(userId: number): Promise<number> {
        const query = `INSERT INTO Orders (user_id) OUTPUT INSERTED.* VALUES (@UserId)`;
        const result = await this.databaseService.executeQuery<any>(query, { UserId: userId });

        return result[0].id;
    }

    async findAll(): Promise<Order[]> {
        const query = `SELECT * FROM Orders`;
        return await this.databaseService.executeQuery<Order>(query);
    }

    async findById(id: number): Promise<Order | null> {
        const query = `
            SELECT O.*, U.id AS userId, U.nick_name, U.email FROM Orders AS O
            INNER JOIN Users AS U ON O.user_id = U.id
            WHERE O.id = @Id            
        `;
        const result = await this.databaseService.executeQuery<Order>(query, { Id: id });
        return result[0] || null;
    }

    async findByUserId(userId: number): Promise<Order[]> {
        const query = `SELECT * FROM Orders WHERE user_id = @UserId`;
        return await this.databaseService.executeQuery<Order>(query, { UserId: userId });
    }

    async findProductOrders(product_id: number): Promise<Order[]> {
        const query = `
            SELECT O.* FROM Orders AS O 
            INNER JOIN Order_Items AS OI ON O.id = OI.order_id
            INNER JOIN Products AS P ON OI.product_id = P.id
            WHERE P.id = @ProductId
        `;
        return await this.databaseService.executeQuery<Order>(query, { ProductId: product_id });
    }

    async updateOrderTotal(id: number, total: number): Promise<Order> {
        const query = `
            UPDATE Orders
            SET total = @Total
            OUTPUT INSERTED.*
            WHERE id = @Id
        `;
        const result = await this.databaseService.executeQuery<Order>(query, { Id: id, Total: total });
        return result[0];
    }

    async deleteOrder(id: number): Promise<void> {
        const query = `DELETE FROM Orders WHERE id = @Id`;
        await this.databaseService.executeQuery(query, { Id: id });
    }
}