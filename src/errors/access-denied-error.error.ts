import { CustomError } from '../utils/custom-error.utils';

export class AccessDeniedError extends CustomError {
    StatusCode = 403;
    constructor(public message: string) {
        super(message);
        Object.setPrototypeOf(this, AccessDeniedError.prototype);
    }

    serialize(): { message: string } {
        return { message: this.message || 'Access Denied' };
    }
}
