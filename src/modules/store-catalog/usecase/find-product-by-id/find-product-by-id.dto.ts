export interface FindProductByIdInputDto {
    id: string;
}

export interface FindProductByIdOutputDto {
    id: string;
    name: string;
    description: string;
    salesPrice: number;
}