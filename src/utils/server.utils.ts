import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from 'config';
import cookieParser from 'cookie-parser';
import routes from '../routes';
import { errorHandler } from '../middleware/error-handler.middleware';
import { NotFoundError } from '../errors/not-found-error.error';
import { InternalServerError } from '../errors/internal-server-error.error';
import { AccessDeniedError } from '../errors/access-denied-error.error';

const origins = JSON.parse(config.get<string>('origin'));
const externalApis = JSON.parse(config.get<string>('externalApis'));

const createServer = (): Express => {
    const app = express();
    app.use(cookieParser());
    app.use(express.json());
    app.use(
        cors({
            origin: (origin, callback) => {
                if (origins.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new AccessDeniedError('Access Denied'));
                }
            },
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: [
                'Content-Type',
                'Authorization',
                'X-XSRF-TOKEN',
                'X-CSRF-Token'
            ],
            credentials: true
        })
    );
    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    imgSrc: ["'self'", 'data:'],
                    connectSrc: ["'self'", ...externalApis],
                    fontSrc: ["'self'"],
                    objectSrc: ["'none'"],
                    frameAncestors: ["'none'"],
                    baseUri: ["'self'"]
                }
            },
            xssFilter: true,
            noSniff: true,
            frameguard: {
                action: 'deny'
            },
            hsts: {
                maxAge: 31536000,
                includeSubDomains: true,
                preload: true
            },
            referrerPolicy: {
                policy: 'strict-origin-when-cross-origin'
            },
            hidePoweredBy: true
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
