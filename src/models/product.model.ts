import mongoose, { Document, Schema } from 'mongoose';
import { UserDocument } from './user.model';

const nanoId = (length: number): string =>
    Array.from(
        { length },
        () =>
            'abcdefghijklmnopqrstuvwxyz0123456789'[
                Math.floor(Math.random() * 36)
            ]
    ).join('');

export interface Product {
    user: UserDocument['_id'];
    title: string;
    description: string;
    price: number;
    image: string;
}

export interface ProductDocument extends Document, Product {
    productId: string;
    createdAt: Date;
    updatedAt: Date;
}

const prodcutSchema = new Schema<ProductDocument>(
    {
        productId: {
            type: String,
            required: true,
            unique: true,
            default: () => `product_${nanoId(10)}`
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    { timestamps: true }
);

const ProductModel = mongoose.model<ProductDocument>('Product', prodcutSchema);

export default ProductModel;
