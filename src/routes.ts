import { type Express, type Request, type Response } from 'express';
import {
    authLoginHandler,
    authLogoutHandler,
    authRegisterHandler,
    authUserSessionsHandler
} from './controllers/auth.controller';
import {
    authLoginValidator,
    authRegisterValidator
} from './validators/auth.validator';
import validateRequest from './middleware/validate-request.middleware';
import authenticateUser from './middleware/authenticate-user.middleware';

const routes = (app: Express): void => {
    /* None Authneticated Routes */

    /* Health Route */
    app.get('/healthcheck', (req: Request, res: Response) =>
        res.sendStatus(200)
    );

    /* Auth Routes */
    app.post(
        '/api/register',
        validateRequest(authRegisterValidator),
        authRegisterHandler
    );

    app.post(
        '/api/login',
        validateRequest(authLoginValidator),
        authLoginHandler
    );

    /* Authneticated Routes */

    app.use(authenticateUser);

    /* Auth Routes */

    app.get('/api/sessions', authUserSessionsHandler);
    app.get('/api/logout', authLogoutHandler);
};

export default routes;
