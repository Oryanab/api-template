import { CustomError } from '../utils/custom-error.utils';

export class InternalServerError extends CustomError {
    StatusCode = 500;
    constructor(public message: string) {
        super(message);
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }

    serialize(): { message: string } {
        return { message: this.message || 'Internal server error' };
    }
}
