import { type Express, type Request, type Response } from 'express';
import { authRegisterHandler } from './controllers/auth.controller';
import { authRegisterValidator } from './validators/auth.validator';
import validateRequest from './middleware/validate-request.middleware';

const routes = (app: Express): void => {
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
};

export default routes;
