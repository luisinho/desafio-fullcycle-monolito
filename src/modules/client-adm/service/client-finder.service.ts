import { NotFoudException } from "@shared/domain/validation/not-found.exception";
import ClientAdmFacadeInterface, { FindClientFacadeOutputDto } from "../facade/client-adm.facade.interface";

export default class ClientFinderService {

    constructor(private clientFacade: ClientAdmFacadeInterface) {}

    async find({ id, document }: { id?: string; document?: string }): Promise<FindClientFacadeOutputDto> {

      if (id && document) {

         const client = await this.clientFacade.findById({ id });

         if (client.document !== document) {
             throw new NotFoudException('Client ID and document do not match.');
         }

         return client;
      }

      if (id) {
          return this.clientFacade.findById({ id });
      }

      if (document) {
          return this.clientFacade.findByDocument({ document });
      }

      throw new NotFoudException('You must provide either id or document.');
    }
  }