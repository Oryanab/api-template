import express, { type Express } from 'express';
import cors from 'cors';
import config from 'config';
import cookieParser from 'cookie-parser';
import routes from '../routes';

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
    return app;
};

export default createServer;
