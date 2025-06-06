export interface AddClientFacadeInputDto {
    id?: string;
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
}

export interface AddClientOutputDto {
    id?: string;
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
}

export interface FindClientByIdFacadeInputDto {
    id: string;
}

export interface FindClientFacadeOutputDto {
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

export interface FindClientByDocumentFacadeInputDto {
    document: string;
}

export default interface ClientAdmFacadeInterface {
    add(input: AddClientFacadeInputDto):Promise<AddClientOutputDto>;
    findById(input: FindClientByIdFacadeInputDto): Promise<FindClientFacadeOutputDto>;
    findByDocument(input: FindClientByDocumentFacadeInputDto): Promise<FindClientFacadeOutputDto>;
}