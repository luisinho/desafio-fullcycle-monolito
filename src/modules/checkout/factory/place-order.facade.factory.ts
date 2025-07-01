import CheckoutGateway from "../gateway/checkout.gateway";
import PlaceOrderFacade from '../facade/place-order.facade';
import OrderRepository from "../repository/order.repository";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";
import PaymentFacadeInterface from "../../payment/facade/facade.interface";
import PlaceOrderFacadeInterface from "../facade/place-order.facade.interface";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import InvoiceFacadeFactory from "../../invoice/factory/invoice-facade.factory";
import PaymentFacadeFactory from "../../payment/factory/payment.facade.factory";
import ClientFinderService from '../../client-adm/service/client-finder.service';
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import InvoiceFacadeInterface from "../../invoice/facade/invoice-facade.interface";
import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import ClientAdmFacadeInterface from "../../client-adm/facade/client-adm.facade.interface";
import ProductAdmFacadeInterface from "../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../store-catalog/facade/store-catalog.facade.interface";
import FindPlaceOrderByIdUsecase from "../usecase/find-place-order-by-id/find-place-order-by-id.usecase";
import FindPlaceOrderByDocumentUsecase from "../usecase/find-place-order-by-document/find-place-order-by.document.usecase";

export default class PlaceOrderFacadeFactory {

    static create(deps?: {
        clientAdmFacade?: ClientAdmFacadeInterface,
        clientFinderService?: ClientFinderService,
        productFacade?: ProductAdmFacadeInterface,
        catalogFacade?: StoreCatalogFacadeInterface,
        orderRepository?: CheckoutGateway,
        invoiceFacade?: InvoiceFacadeInterface,
        paymentFacade?: PaymentFacadeInterface,
        
      }): PlaceOrderFacadeInterface {
        const clientAdmFacade = deps?.clientAdmFacade ?? ClientAdmFacadeFactory.create();
        const productFacade = deps?.productFacade ?? ProductAdmFacadeFactory.create();
        const catalogFacade = deps?.catalogFacade ?? StoreCatalogFacadeFactory.create();
        const orderRepository = deps?.orderRepository ?? new OrderRepository();
        const invoiceFacade = deps?.invoiceFacade ?? InvoiceFacadeFactory.create();
        const paymentFacade = deps?.paymentFacade ?? PaymentFacadeFactory.create();
        const clientFinderService = deps?.clientFinderService ?? new ClientFinderService(clientAdmFacade);

        const addOrderUseCase = new PlaceOrderUseCase(
          productFacade,
          catalogFacade,
          orderRepository,
          invoiceFacade,
          paymentFacade,
          clientFinderService,
        );

        const findOrderByIdUsecase = new FindPlaceOrderByIdUsecase(
          orderRepository,
          invoiceFacade,
        );

        const findPlaceOrderByDocumentUseCase = new FindPlaceOrderByDocumentUsecase(
          orderRepository,
          invoiceFacade,
          clientAdmFacade,
        );

        return new PlaceOrderFacade({
          addOrderUseCase,
          findOrderByIdUsecase,
          findPlaceOrderByDocumentUseCase,
        });
    }
}