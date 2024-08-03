import { type Express, type Request, type Response } from 'express';
import {
    authLoginHandler,
    authLogoutHandler,
    authRegisterHandler,
    authSessionHandler,
    authUserSessionsHandler
} from './controllers/auth.controller';
import {
    authLoginValidator,
    authRegisterValidator
} from './validators/auth.validator';
import validateRequest from './middleware/validate-request.middleware';
import authenticateUser from './middleware/authenticate-user.middleware';
import {
    createProductHandler,
    deleteProductHandler,
    getProductHandler,
    updateProductHandler
} from './controllers/product.controller';
import {
    createProductSchema,
    deleteProductSchema,
    getProductSchema,
    updateProductSchema
} from './validators/product.validator';
import {
    apiRequestLimiter,
    authLoginLimiter,
    authRegisterLimiter
} from './middleware/rate-limiting.middleware';

const routes = (app: Express): void => {
    /* None Authneticated Routes */

    /* Health Route */
    app.get('/healthcheck', (req: Request, res: Response) =>
        res.sendStatus(200)
    );

    /* Auth Routes */
    app.post(
        '/api/register',
        [authRegisterLimiter, validateRequest(authRegisterValidator)],
        authRegisterHandler
    );

    app.post(
        '/api/login',
        [authLoginLimiter, validateRequest(authLoginValidator)],
        authLoginHandler
    );

    /* Authneticated Routes */
    app.use('/api', [apiRequestLimiter, authenticateUser]);

    /* Auth Routes */
    app.get('/api/session', authSessionHandler);
    app.get('/api/sessions', authUserSessionsHandler);
    app.get('/api/logout', authLogoutHandler);

    /* Your Product Routes */

    app.post(
        '/api/products',
        validateRequest(createProductSchema),
        createProductHandler
    );

    app.put(
        '/api/products',
        validateRequest(updateProductSchema),
        updateProductHandler
    );

    app.get(
        '/api/products',
        validateRequest(getProductSchema),
        getProductHandler
    );

    app.delete(
        '/api/products',
        validateRequest(deleteProductSchema),
        deleteProductHandler
    );
};

export default routes;
