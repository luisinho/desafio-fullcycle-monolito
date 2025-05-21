export class NotFoudException extends Error {

    constructor(message: string) {
       super(message);
       this.name = 'NotFoudException';
    }
}