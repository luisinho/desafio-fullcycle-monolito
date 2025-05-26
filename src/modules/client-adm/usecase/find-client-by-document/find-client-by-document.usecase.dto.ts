export interface FindClientByDocumentInputDto {
    document: string;
}

export interface FindClientByDocumentOutputDto {
    id: string;
    name: string;
    email: string;
    documentType: string;
    document: string;
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
    createdAt: Date;
    updatedAt: Date;
}