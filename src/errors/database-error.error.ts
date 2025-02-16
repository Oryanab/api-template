import { CustomError } from '../utils/custom-error.utils';

export class DatabaseError extends CustomError {
    StatusCode = 500;
    constructor(public message: string) {
        super(message);
        Object.setPrototypeOf(this, DatabaseError.prototype);
    }

    serialize(): { message: string } {
        return { message: this.message || 'Database error' };
    }
}
