export interface FindInvoiceUseCaseInputDto {
    id: string;
}

export interface ListInvoiceByIdsUseCaseInputDto {
  ids: string[];
}

export interface FindInvoiceUseCaseOutputDto {
    id: string;
    name: string;
    document: string;
    address: {
      street: string;
      number: string;
      complement: string;
      city: string;
      state: string;
      zipCode: string;
    };
    items: {
      id: string;
      name: string;
      price: number;
      quantity: number;
    }[];
    total: number;
    createdAt: Date;
  }

  export interface GenerateInvoiceUseCaseInputDto {
    name: string;
    document: string;
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
    items: {
      id: string;
      name: string;
      price: number;
      quantity: number;
    }[];
}
  
export interface GenerateInvoiceUseCaseOutputDto {
    id: string;
    name: string;
    document: string;
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
    items: {
      id: string;
      name: string;
      price: number;
      quantity: number;
    }[];
    total: number;
}

export default interface InvoiceFacadeInterface {
  find(input: FindInvoiceUseCaseInputDto): Promise<FindInvoiceUseCaseOutputDto>;
  generate(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto>;
  listByIds(input: ListInvoiceByIdsUseCaseInputDto): Promise<FindInvoiceUseCaseOutputDto[]>;
}