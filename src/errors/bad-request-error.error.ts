import { CustomError } from '../utils/custom-error.utils';

export class BadRequestError extends CustomError {
    StatusCode = 400;
    constructor(public message: string) {
        super(message);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serialize(): { message: string } {
        return { message: this.message || 'Bad Request' };
    }
}
