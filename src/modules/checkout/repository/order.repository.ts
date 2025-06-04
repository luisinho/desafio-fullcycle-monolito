import OrderModel from "../repository/order.model";
import ProductModel from "../repository/product.model";
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
        });
    }

    async findOrderById(id: string): Promise<Order | null> {

       const order = await OrderModel.findOne({
            where: { id },
            include: ['products']
        });

        if (!order) {
            throw new NotFoudException(`Order with id ${id} not found.`);
        }

        const products: Product[] =  this.getProducts(order);

        return new Order({
            id: new OrderId(order.id),
            client: null,
            products,
            status: order.status,
            invoiceId: order.invoiceId,
        });
    }

    private getProducts(orderModel: OrderModel): Product[] {

        let product: Product;
        let products: Product[] = [];

        /*orderModel.products.map((productModel: ProductModel) => {

            let props = {
                id: new ProductId(productModel.id),
                name: productModel.name,
                description: '',
                salesPrice:productModel.salesPrice,
            };

            product = new Product(props);
            products.push(product);
        });*/

      return products;    
    }
}