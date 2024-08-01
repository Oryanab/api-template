import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import ProductModel, {
    Product,
    ProductDocument
} from '../models/product.model';
import logger from '../utils/logger.utils';

export const createProduct = async (
    input: Product
): Promise<ProductDocument> => {
    try {
        return ProductModel.create(input);
    } catch (e: any) {
        logger.error(e);
        throw new Error('Failed to create product, please try again later');
    }
};
export const findProduct = async (
    query: FilterQuery<ProductDocument>,
    options: QueryOptions = { lean: true }
): Promise<ProductDocument | null> => {
    try {
        return ProductModel.findOne(query, {}, options);
    } catch (e: any) {
        logger.error(e);
        throw new Error('Failed to find product, please try again later');
    }
};
export const findAndUpdateProduct = async (
    query: FilterQuery<ProductDocument>,
    update: UpdateQuery<ProductDocument>,
    options: QueryOptions = { lean: true }
): Promise<ProductDocument | null> => {
    try {
        return ProductModel.findOneAndUpdate(query, update, options);
    } catch (e: any) {
        logger.error(e);
        throw new Error('Failed to find product, please try again later');
    }
};
export const deleteProduct = async (
    query: FilterQuery<ProductDocument>
): Promise<any> => {
    try {
        return ProductModel.deleteOne(query);
    } catch (e: any) {
        logger.error(e);
        throw new Error('Failed to find product, please try again later');
    }
};
