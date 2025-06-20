import OrderModel from "../repository/order.model";
import OrderItemModel from "../repository/order-item.model";
import Order, { OrderId } from "../domain/order.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import Product, { ProductId } from "../domain/product.entity";
import { NotFoudException } from "@shared/domain/validation/not-found.exception";

export default class OrderRepository implements CheckoutGateway {

    async addOrder(order: Order): Promise<void> {

        await OrderModel.create({
            id: order.id.id,
            invoiceId: order.invoiceId,
            status: order.status,
            total: order.total,
            clientId: order.clientId,
            createdAt: new Date(),
            updatedAt: new Date(),
            orderItems: this.getOrderItemModel(order),
        },
        {
          include: [{model: OrderItemModel, as: 'orderItems'}],
        });
    }

    async findOrderById(id: string): Promise<Order | null> {

       const order = await OrderModel.findOne({
            where: { id },
            include: ['orderItems']
        });

        if (!order) {
            throw new NotFoudException(`Order with id ${id} not found.`);
        }

        const products: Product[] =  this.getItemsProduct(order);

        return new Order({
            id: new OrderId(order.id),
            clientId: order.clientId,
            products,
            status: order.status,
            invoiceId: order.invoiceId,
            createdAt: order.createdAt,
        });
    }

    async findOrdersByClientId(clientId: string): Promise<Order[]> {

        const orders = await OrderModel.findAll({
            where: { clientId: clientId },
            include: ['orderItems']
        });

        if (!orders) {
            return [];
        }

        return orders.map((order) => {

            const products: Product[] = this.getItemsProduct(order);

            return new Order({
                id: new OrderId(order.id),
                clientId: order.clientId,
                products,
                status: order.status,
                invoiceId: order.invoiceId,
                createdAt: order.createdAt,
            });
        });
    }

    private  getOrderItemModel(order: Order): OrderItemModel [] {

        let orderItemsModel: OrderItemModel[] = [];

        order.products.map((product: Product) => {

            let orderItemModel = new OrderItemModel();

            orderItemModel.productId = product.id.id,
            orderItemModel.orderId = order.id.id,
            orderItemModel.name = product.name,
            orderItemModel.price = product.salesPrice,
            orderItemModel.quantity = product.quantity,

            orderItemsModel.push(orderItemModel);
        });

        return orderItemsModel;
    }

    private getItemsProduct(orderModel: OrderModel): Product[] {

        let product: Product;
        let products: Product[] = [];

        orderModel.orderItems.map((item: OrderItemModel) => {

            let props = {
                id: new ProductId(item.productId),
                name: item.name,
                description: '',
                salesPrice: item.price,
                quantity: item.quantity,
            };

            product = new Product(props);
            products.push(product);
        });

      return products;
    }
}