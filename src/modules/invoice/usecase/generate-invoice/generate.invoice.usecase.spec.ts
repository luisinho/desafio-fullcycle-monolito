import GenerateInvoiceUseCase from "./generate.invoice.usecase";

const items = [
    {
        id: '1',
        name: 'Note Book',
        price: 4.000,
    },
    {
        id: '2',
        name: 'Mac Book',
        price: 10.500,
    }
];

const MockRepository = () => {
    return {
        find: jest.fn(),
        generate: jest.fn(),
    };
}

describe("GenerateInvoice usecase unit test", () => {

    it('should generate a invoice', async () => {

        const invoiceRepository = MockRepository();
        const useCase = new GenerateInvoiceUseCase(invoiceRepository);

        const input = {
            name: 'Sandra',
            document: '962.394.550-75',
            street: 'Paulista',
            number: '3',
            complement: 'Predio',
            city: 'São Paulo',
            state: 'São Paulo',
            zipCode: '01212-100',
            items
        };

        const result = await useCase.execute(input);

        expect(invoiceRepository.generate).toHaveBeenCalled();
        expect(result).not.toBeNull();
        expect(result.id).not.toBeNull();
        expect(result.name).toBe(input.name);
        expect(result.document).toBe(input.document);
        expect(result.street).toBe(input.street);
        expect(result.number).toBe(input.number);
        expect(result.complement).toBe(input.complement);
        expect(result.city).toBe(input.city);
        expect(result.state).toBe(input.state);
        expect(result.zipCode).toBe(input.zipCode);
        expect(result.total).toBe(input.items.reduce((total, item) => total + item.price, 0));

        expect(result.items.length).toBe(2);

        result.items.forEach((item, index) => {
          const expectedItem = input.items[index];
          expect(item.id).toBe(expectedItem.id);
          expect(item.name).toBe(expectedItem.name);
          expect(item.price).toBe(expectedItem.price);
        });
    });

    it('should throw an error when trying to generate an invoice with an invalid address (missing street)', async () => {

        const invoiceRepository = MockRepository();
        const useCase = new GenerateInvoiceUseCase(invoiceRepository);

        const input = {
            name: 'Sandra',
            document: '962.394.550-75',
            street: '',
            number: '3',
            complement: 'Predio',
            city: 'São Paulo',
            state: 'São Paulo',
            zipCode: '01212-100',
            items
        };

        await expect(useCase.execute(input)).rejects.toThrow('All required address fields must be provided!');
    });
});