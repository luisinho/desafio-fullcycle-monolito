import request from "supertest";
import { initApi }  from "../../infrastructure/api/api";
import { dbLojaSequelize } from "../../infrastructure/db/database";

let api: any;

jest.setTimeout(30000);

describe('E2E test for client', () => {

      beforeAll(async () => {        
        api = await initApi();
      });

      afterAll(async () => {
        await dbLojaSequelize.close();
      });

    it('should add a clients', async () => {

         const response = await request(api)
          .post('/clients')
          .set('Accept', 'application/json')
          .send({
                name: 'Sonia',
                email: 'sonia@test.com',
                documentType: 'CPF',
                document: '953.549.440-66',
                street: 'Paulista',
                number: '3',
                complement: 'Predio',
                city: 'São Paulo',
                state: 'SP',
                zipCode: '01030-100',
         });

         expect(response.status).toBe(201);
         expect(response.body.id).toBeDefined();
         expect(response.body.name).toBe('Sonia');
         expect(response.body.email).toBe('sonia@test.com');
         expect(response.body.documentType).toBe('CPF');
         expect(response.body.document).toBe('953.549.440-66');
         expect(response.body.street).toBe('Paulista');
         expect(response.body.number).toBe('3');
         expect(response.body.complement).toBe('Predio');
         expect(response.body.city).toBe('São Paulo');
         expect(response.body.state).toBe('SP');
         expect(response.body.zipCode).toBe('01030-100');
    });

    it('should throw an error when client name is empty', async () => {

        const response = await request(api)
          .post('/clients').send({
                name: '',
                email: 'sonia@test.com',
                documentType: 'CPF',
                document: '953.855.920-72',
                street: 'Paulista',
                number: '3',
                complement: 'Predio',
                city: 'São Paulo',
                state: 'SP',
                zipCode: '01030-100',
         });

         expect(response.status).toBe(422);

         const nameError = response.body.errors.find((err: any) => err.field === 'name');
         expect(nameError).toBeDefined();
         expect(nameError.message).toBe('Name is required.');
    });

    it('should throw an error when client name is less than 3 characters', async () => {

        const response = await request(api)
          .post('/clients').send({
                name: 'So',
                email: 'sonia@test.com',
                documentType: 'CPF',
                document: '044.283.900-68',
                street: 'Paulista',
                number: '3',
                complement: 'Predio',
                city: 'São Paulo',
                state: 'SP',
                zipCode: '01030-100',
         });

         expect(response.status).toBe(422);

         const nameError = response.body.errors.find((err: any) => err.field === 'name');
         expect(nameError).toBeDefined();
         expect(nameError.message).toBe('Name must be at least 3 characters long.');

    });

    it('should throw an error when client email is empty', async () => {

        const response = await request(api)
          .post('/clients').send({
            name: 'Sonia',
            email: '',
            documentType: 'CPF',
            document: '123.456.789-00',
            street: 'Paulista',
            number: '3',
            complement: 'Predio',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01030-100',
        });

        expect(response.status).toBe(422);

        const emailError = response.body.errors.find((err: any) => err.field === 'email');
        expect(emailError).toBeDefined();
        expect(emailError.message).toBe('Email is required.');
    });

    it('should throw an error when client email is invalid', async () => {

        const response = await request(api)
          .post('/clients').send({
            name: 'Sonia',
            email: 'invalidemail.com',
            documentType: 'CPF',
            document: '123.456.789-01',
            street: 'Paulista',
            number: '3',
            complement: 'Predio',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01030-100',
        });

        expect(response.status).toBe(422);

        const emailError = response.body.errors.find((err: any) => err.field === 'email');
        expect(emailError).toBeDefined();
        expect(emailError.message).toBe('Invalid email, please provide a valid email.');
    });

    it('should throw an error when client documentType is empty', async () => {

        const response = await request(api)
          .post('/clients').send({
            name: 'Sonia',
            email: 'sonia@test.com',
            documentType: '',
            document: '123.456.789-02',
            street: 'Paulista',
            number: '3',
            complement: 'Predio',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01030-100',
        });

        expect(response.status).toBe(422);

        const typeError = response.body.errors.find((err: any) => err.field === 'documentType');
        expect(typeError).toBeDefined();
        expect(typeError.message).toBe('Document Type is required.');
    });

    it('should throw an error when client documentType is less than 3 characters', async () => {

        const response = await request(api)
          .post('/clients').send({
            name: 'Sonia',
            email: 'sonia@test.com',
            documentType: 'CP',
            document: '123.456.789-03',
            street: 'Paulista',
            number: '3',
            complement: 'Predio',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01030-100',
        });

        expect(response.status).toBe(422);

        const typeError = response.body.errors.find((err: any) => err.field === 'documentType');
        expect(typeError).toBeDefined();
        expect(typeError.message).toBe('Document Type must be at least 3 characters long.');
    });

    it('should throw an error when client document is empty', async () => {

        const response = await request(api)
          .post('/clients').send({
            name: 'Sonia',
            email: 'sonia@test.com',
            documentType: 'CPF',
            document: '',
            street: 'Paulista',
            number: '3',
            complement: 'Predio',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01030-100',
        });

        expect(response.status).toBe(422);

        const docError = response.body.errors.find((err: any) => err.field === 'document');
        expect(docError).toBeDefined();
        expect(docError.message).toBe('Document is required.');
    });

    it('should throw an error when client document is invalid (not 11 digits)', async () => {

        const response = await request(api)
          .post('/clients').send({
            name: 'Sonia',
            email: 'sonia@test.com',
            documentType: 'CPF',
            document: '111.222.3',
            street: 'Paulista',
            number: '3',
            complement: 'Predio',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01030-100',
        });

        expect(response.status).toBe(422);

        const docError = response.body.errors.find((err: any) => err.field === 'document');
        expect(docError).toBeDefined();
        expect(docError.message).toBe('Invalid document, CPF must contain exactly 11 digits.');
    });

    it('should throw an error when client address street is empty', async () => {

        const response = await request(api)
          .post('/clients').send({
            name: 'Sonia',
            email: 'sonia@test.com',
            documentType: 'CPF',
            document: '369.064.130-66',
            street: '',
            number: '3',
            complement: 'Predio',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01030-100',
        });

        expect(response.status).toBe(422);

        const docError = response.body.errors.find((err: any) => err.field === 'street');
        expect(docError).toBeDefined();
        expect(docError.message).toBe('Street is required.');
    });

    it('should throw an error when client address street is less than 3 characters', async () => {

      const response = await request(api)
        .post('/clients').send({
          name: 'Sonia',
          email: 'sonia@test.com',
          documentType: 'CPF',
          document: '241.694.900-45',
          street: 'Pa',
          number: '3',
          complement: 'Predio',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01030-100',
      });

      expect(response.status).toBe(422);

      const docError = response.body.errors.find((err: any) => err.field === 'street');
      expect(docError).toBeDefined();
      expect(docError.message).toBe('Street must be at least 3 characters long.');
    });


    it('should throw an error when client address number is empty', async () => {

      const response = await request(api)
        .post('/clients').send({
          name: 'Sonia',
          email: 'sonia@test.com',
          documentType: 'CPF',
          document: '761.591.270-98',
          street: 'Paulista',
          number: '',
          complement: 'Predio',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01030-100',
      });

      expect(response.status).toBe(422);

      const docError = response.body.errors.find((err: any) => err.field === 'number');
      expect(docError).toBeDefined();
      expect(docError.message).toBe('Number is required.');
    });

    it('should throw an error when client address city is empty', async () => {

      const response = await request(api)
        .post('/clients').send({
          name: 'Sonia',
          email: 'sonia@test.com',
          documentType: 'CPF',
          document: '509.689.550-53',
          street: 'Paulista',
          number: '3',
          complement: 'Predio',
          city: '',
          state: 'SP',
          zipCode: '01030-100',
      });

      expect(response.status).toBe(422);

      const docError = response.body.errors.find((err: any) => err.field === 'city');
      expect(docError).toBeDefined();
      expect(docError.message).toBe('City is required.');
    });

    it('should throw an error when client address city is less than 3 characters', async () => {

      const response = await request(api)
        .post('/clients').send({
          name: 'Sonia',
          email: 'sonia@test.com',
          documentType: 'CPF',
          document: '778.703.450-59',
          street: 'Paulista',
          number: '3',
          complement: 'Predio',
          city: 'Sa',
          state: 'SP',
          zipCode: '01030-100',
      });

      expect(response.status).toBe(422);

      const docError = response.body.errors.find((err: any) => err.field === 'city');
      expect(docError).toBeDefined();
      expect(docError.message).toBe('City must be at least 3 characters long.');
    });

    it('should throw an error when client address state is empty', async () => {

      const response = await request(api)
        .post('/clients').send({
          name: 'Sonia',
          email: 'sonia@test.com',
          documentType: 'CPF',
          document: '968.511.860-47',
          street: 'Paulista',
          number: '3',
          complement: 'Predio',
          city: 'São Paulo',
          state: '',
          zipCode: '01030-100',
      });

      expect(response.status).toBe(422);

      const docError = response.body.errors.find((err: any) => err.field === 'state');
      expect(docError).toBeDefined();
      expect(docError.message).toBe('State is required.');
    });

    it('should throw an error when client address state is less than 2 characters', async () => {

      const response = await request(api)
        .post('/clients').send({
          name: 'Sonia',
          email: 'sonia@test.com',
          documentType: 'CPF',
          document: '233.853.550-28',
          street: 'Paulista',
          number: '3',
          complement: 'Predio',
          city: 'São Paulo',
          state: 'S',
          zipCode: '01030-100',
      });

      expect(response.status).toBe(422);

      const docError = response.body.errors.find((err: any) => err.field === 'state');
      expect(docError).toBeDefined();
      expect(docError.message).toBe('State must be at least 2 characters long.');
    });


    it('should throw an error when client address zipCode is empty', async () => {

      const response = await request(api)
        .post('/clients').send({
          name: 'Sonia',
          email: 'sonia@test.com',
          documentType: 'CPF',
          document: '010.986.610-01',
          street: 'Paulista',
          number: '3',
          complement: 'Predio',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '',
      });

      expect(response.status).toBe(422);

      const docError = response.body.errors.find((err: any) => err.field === 'zipCode');
      expect(docError).toBeDefined();
      expect(docError.message).toBe('Zip Code is required.');
    });

    it('should throw an error when client address zipCode is invalid (not 8 digits)', async () => {

      const response = await request(api)
        .post('/clients').send({
          name: 'Sonia',
          email: 'sonia@test.com',
          documentType: 'CPF',
          document: '911.483.110-41',
          street: 'Paulista',
          number: '3',
          complement: 'Predio',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01030-10',
      });

      expect(response.status).toBe(422);

      const docError = response.body.errors.find((err: any) => err.field === 'zipCode');
      expect(docError).toBeDefined();
      expect(docError.message).toBe('Invalid document, Zip Code must contain exactly 8 digits.');
    });

    it('should return 409 when trying to add a client with an existing document', async () => {

      const payload =  {
          name: 'Sonia',
          email: 'sonia@test.com',
          documentType: 'CPF',
          document: '469.262.430-26',
          street: 'Paulista',
          number: '3',
          complement: 'Predio',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01030-100',
      };

      const response201 = await request(api).post('/clients').send(payload);
      expect(response201.status).toBe(201);    

      const response409 = await request(api).post('/clients').send(payload);
      expect(response409.status).toBe(409);
      expect(response409.body.message).toBe('Client with document 469.262.430-26 already exists');
    });

    it('should return 404 when find by id client not found', async () => {

        const response = await request(api).get('/clients/1');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Client with id 1 not found.');
    });

    it('should return 404 when find by document client not found', async () => {

      const response = await request(api).get('/clients/document/521.785.130-93');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Client with document 521.785.130-93 not found.');
  });
});