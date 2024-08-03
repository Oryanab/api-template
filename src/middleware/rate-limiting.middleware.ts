import rateLimit from 'express-rate-limit';

export const apiRequestLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});

export const authLoginLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts, please try again later.'
});

export const authRegisterLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 5,
    message: 'Too many registation attempts, please try again later.'
});
