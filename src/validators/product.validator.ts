import { object, number, string, TypeOf } from 'zod';

const payload = {
    body: object({
        title: string({
            required_error: 'Title is required'
        }),
        description: string({
            required_error: 'Descriiption is required'
        }).min(120, 'Description should be at least 120 char long'),
        price: number({
            required_error: 'Price is required'
        }),
        image: string({
            required_error: 'Image is required'
        })
    })
};

const params = {
    params: object({
        productId: string({
            required_error: 'Product Id is required'
        })
    })
};

export const createProductSchema = object({
    ...payload
});

export const updateProductSchema = object({
    ...payload,
    ...params
});

export const deleteProductSchema = object({
    ...params
});

export const getProductSchema = object({
    ...params
});

export type CreateProductSchema = TypeOf<typeof createProductSchema>;
export type UpdateProductSchema = TypeOf<typeof updateProductSchema>;
export type DeleteProductSchema = TypeOf<typeof deleteProductSchema>;
export type GetProductSchema = TypeOf<typeof getProductSchema>;
