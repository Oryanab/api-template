import { object, string, TypeOf } from 'zod';

export const authRegisterValidator = object({
    body: object({
        name: string({
            required_error: 'Name is required'
        }),
        password: string({
            required_error: 'Password is required'
        }).min(6, 'Too short should be 6 chars minimum'),
        passwordConfirm: string({
            required_error: 'Password Confirm is required'
        }),
        email: string({
            required_error: 'Email is required'
        }).email('Not a valid email')
    })
        .strict()
        .refine((data) => data.password === data.passwordConfirm, {
            message: 'Passwords do not match',
            path: ['passwordConfirm']
        })
});

export type AuthRegisterValidator = Omit<
    TypeOf<typeof authRegisterValidator>,
    'body.passwordConfirm'
>;
