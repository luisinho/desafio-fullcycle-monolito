import Order from "../../domain/order.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import Client, { ClientId } from "../../domain/client.entity";
import Product, { ProductId } from "../../domain/product.entity";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";
import PaymentFacadeInterface from "../../../payment/facade/facade.interface";
import ClientFinderService from '../../../client-adm/service/client-finder.service';
import InvoiceFacadeInterface from "../../../invoice/facade/invoice-facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";

import { NotFoudException } from "@shared/domain/validation/not-found.exception";
import { ConflictException } from "@shared/domain/validation/conflict.exception";
import { BadRequestException  } from "@shared/domain/validation/bad-request.exception";

export default class PlaceOrderUseCase implements UseCaseInterface {

   private _productFacade: ProductAdmFacadeInterface;
   private _catalogFacade: StoreCatalogFacadeInterface;
   private _repository: CheckoutGateway;
   private _invoiceFacade: InvoiceFacadeInterface;
   private _paymentFacade: PaymentFacadeInterface;
   private _clientFinderService: ClientFinderService;

   constructor(
     productFacade: ProductAdmFacadeInterface,
     catalogFacade: StoreCatalogFacadeInterface,
     repository: CheckoutGateway,
     invoiceFacade: InvoiceFacadeInterface,
     paymentFacade: PaymentFacadeInterface,
     clientFinderService: ClientFinderService,
    ) {
     this._productFacade = productFacade;
     this._catalogFacade = catalogFacade;
     this._repository = repository;
     this._invoiceFacade = invoiceFacade;
     this._paymentFacade = paymentFacade;
     this._clientFinderService = clientFinderService;
   }

   async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {

       const client = await this._clientFinderService.find({ id: input.clientId, document: input.document });

       await this.validateProducts(input);

       await this.validateProductsStock(input);

       const products = await Promise.all(
         input.products.map((p) => this.getProduct(p.productId, p.quantity))
       );

       const myClient = new Client({
          id: new ClientId(client.id),
          name: client.name,
          email: client.email,
          document: client.document,
          street: client.street,
          number: client.number,
          complement: client.complement,
          city: client.city,
          state: client.state,
          zipCode: client.zipCode,
       });

       const order = new Order({
         client: myClient,
         products
       });

       const payment = await this._paymentFacade.process({
          orderId: order.id.id,
          amount: order.total,
       });

       const invoice = 
           payment.status === 'approved' 
             ? await this._invoiceFacade.generate({
                name: client.name,            
                document: client.document,
                street: client.street,
                number: client.number,
                complement: client.complement,
                city: client.city,
                state: client.state,
                zipCode: client.zipCode,
                items: products.map((p) => {
                  return {
                    id: p.id.id,
                    name: p.name,
                    price: p.salesPrice,
                    quantity: p.quantity,
                  };
                }),
             })
           : null;

        if (payment.status === 'approved') {
            order.approved();
        } else if (payment.status === 'declined') {
            order.declined();
        }

        order.changeInvoiceId(payment.status === 'approved' ? invoice.id : null);
        this._repository.addOrder(order);

       return {
           id: order.id.id,
           invoiceId: payment.status === 'approved' ? invoice.id : null,
           status: order.status,
           total: order.total,
           products: order.products.map((p) => {
             return {
                productId: p.id.id,
                quantity: p.quantity,
             };
           }),
       };        
    }

    private async validateProducts(input: PlaceOrderInputDto): Promise<void> {

        if (input.products.length == 0) {
            throw new BadRequestException('No products selected.');
        }
    }

    private async validateProductsStock(input: PlaceOrderInputDto): Promise<void> {

        for (const p of input.products) {
            const product = await this._productFacade.checkStock({
                productId: p.productId,
            });

            if (product.stock <= 0) {
                throw new ConflictException(`Product ${product.productId} is not available in stock.`);
            }
        }
    }

    private async getProduct(productId: string, quantity: number): Promise<Product> {

        const product = await this._catalogFacade.find({ id: productId});

        if (!product) {
            throw new NotFoudException(`Product ${productId} not found.`);
        }

        const  productProps = {
            id: new ProductId(product.id),
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice,
            quantity,
        };

        return new Product(productProps);
    }
}