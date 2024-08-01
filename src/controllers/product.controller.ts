import { Request, Response } from 'express';
import {
    CreateProductSchema,
    DeleteProductSchema,
    GetProductSchema,
    UpdateProductSchema
} from '../validators/product.validator';
import {
    createProduct,
    deleteProduct,
    findAndUpdateProduct,
    findProduct
} from '../services/product.service';

export const createProductHandler = async (
    request: Request<{}, {}, CreateProductSchema['body']>,
    response: Response
): Promise<void> => {
    const userId = response.locals.user._id;
    const { title, image, description, price } = request.body;
    const product = await createProduct({
        title,
        image,
        description,
        price,
        user: userId
    });
    response.status(200).send(product);
};

export const updateProductHandler = async (
    request: Request<
        UpdateProductSchema['params'],
        {},
        CreateProductSchema['body']
    >,
    response: Response
): Promise<void> => {
    const userId = response.locals.user._id;
    const productId = request.params.productId;
    const update = request.body;

    const product = await findProduct({ productId });

    if (!product) {
        response.status(404).send('Product not found');
    }

    if (!product?.user !== userId) {
        response
            .status(403)
            .send('only user who created the procut can edit it');
    }

    const updateProduct = await findAndUpdateProduct({ productId }, update, {
        new: true
    });

    response.send(200).send(updateProduct);
};

export const getProductHandler = async (
    request: Request<GetProductSchema['params']>,
    response: Response
): Promise<void> => {
    const productId = request.params.productId;
    const product = await findProduct({ productId });

    if (!product) {
        response.status(404).send('Product not found');
    }
    response.send(200).send(product);
};

export const deleteProductHandler = async (
    request: Request<DeleteProductSchema['params']>,
    response: Response
): Promise<void> => {
    const userId = response.locals.user._id;
    const productId = request.params.productId;
    const product = await findProduct({ productId });

    if (!product) {
        response.status(404).send('Product not found');
    }

    if (!product?.user !== userId) {
        response
            .status(403)
            .send('only user who created the procut can edit it');
    }

    const updateProduct = await deleteProduct({ productId });
    response.send(200).send(updateProduct);
};