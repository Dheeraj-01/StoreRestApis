import mongoose from 'mongoose';
import { APP_URL } from '../../config';
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    image: { type: String, required: true , get : (image) =>{
        // uploads\\1626955133468-924820414.jpg
        return `${APP_URL}/${image}`

    } },
    
}, { timestamps: true , toJSON: {getters: true}});

export default mongoose.model('Product', productSchema, 'products');