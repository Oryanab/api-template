import express, { type Express } from 'express';
import cors from 'cors';
import config from 'config';
import cookieParser from 'cookie-parser';
import routes from '../routes';
import { errorHandler } from '../middleware/error-handler.middleware';
import { NotFoundError } from '../errors/not-found-error.error';
import { InternalServerError } from '../errors/internal-server-error.error';

const createServer = (): Express => {
    const app = express();
    app.use(cookieParser());
    app.use(express.json());
    app.use(
        cors({
            origin: config.get<string>('origin'),
            credentials: true
        })
    );

    routes(app);
    app.use(() => {
        throw new NotFoundError('Not Found');
    });
    app.use(() => {
        throw new InternalServerError('Something went wrong!');
    });
    app.use(errorHandler);
    return app;
};

export default createServer;
