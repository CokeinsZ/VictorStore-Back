import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CheckPolicies } from 'src/tools/decorators/check-policies.decorator';
import { Action } from 'src/tools/abilities/ability.factory';
import { CreateOrderDto, UpdateOrderDto, UpdateOrderItemStatusDto } from './dtos/order.dto';
import { Roles } from 'src/tools/decorators/roles.decorator';
import { user_role } from 'src/users/interfaces/user.interface';
import { OrderStatus } from './interfaces/order.interface';

@Controller('vs/api/v1/orders')
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService,
    ) { }

    @Post()
    @CheckPolicies({ action: Action.Create, subject: 'Order' })
    async createOrder(@Body() dto: CreateOrderDto) {
        return await this.ordersService.createOrder(dto);
    }

    @Get()
    @Roles(user_role.ADMIN, user_role.EDITOR)
    async findAllOrders() {
        return await this.ordersService.findAllOrders();
    }

    @Get(':id')
    @CheckPolicies({ action: Action.Read, subject: 'Order' })
    async findOrderById(@Param('id') id: number, @Request() req) {
        const order = await this.ordersService.findOrderById(id);

        if (req.user.role === user_role.USER && req.user.id !== order.user.id) {
            // If the user is not an admin and is trying to access another user's orders
            throw new ForbiddenException('You do not have permission to access this resource');
        }

        return order;
    }

    @Get('user/:id')
    @CheckPolicies({ action: Action.Read, subject: 'Order' })
    async findOrdersByUserId(@Param('id') id: number, @Request() req) {
        if (req.user.role === user_role.USER && req.user.id !== id) {
            // If the user is not an admin and is trying to access another user's orders
            throw new ForbiddenException('You do not have permission to access this resource');
        }
        return await this.ordersService.findOrdersByUserId(id);
    }

    @Get(':id/status/:status')
    @Roles(user_role.ADMIN, user_role.EDITOR)
    async findOrdersByStatus(@Param('id') id: number, @Param('status') status: OrderStatus) {
        return await this.ordersService.findOrderItemsByStatus(id, status);
    }

    @Get('product/:productId')
    @Roles(user_role.ADMIN, user_role.EDITOR)
    async findProductOrders(@Param('productId') productId: number) {
        return await this.ordersService.findProductOrders(productId);
    }

    @Put(':id')
    @CheckPolicies({ action: Action.Update, subject: 'Order' })
    async updateOrder(@Param('id') id: number, @Body() dto: UpdateOrderDto) {
        const order = await this.ordersService.findOrderById(id);
        if (!order) {
            throw new ForbiddenException('Order not found');
        }

        return await this.ordersService.updateOrder(id, dto);
    }

    @Put('orderItem/status')
    @CheckPolicies({ action: Action.Update, subject: 'Order.status' })
    async updateOrderItemStatus(@Body() dto: UpdateOrderItemStatusDto) {
        return await this.ordersService.updateOrderItemStatus(dto.order_id, dto.product_id, dto.status);
    }

    @Delete(':id')
    @CheckPolicies({ action: Action.Delete, subject: 'Order' })
    async deleteOrder(@Param('id') id: number, @Request() req) {
        const order = await this.ordersService.findOrderById(id);
        if (req.user.role === user_role.USER) {
            if (req.user.id !== order.user.id) {
                // If the user is not an admin and is trying to access another user's orders
                throw new ForbiddenException('You do not have permission to access this resource');
            }

        }
        return await this.ordersService.deleteOrder(id);
    }
}
