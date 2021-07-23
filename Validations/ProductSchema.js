import Joi from 'joi';

// DONE Check Data is proper or not 
const ProductSchema =  Joi.object({
    name : Joi.string().min(3).max(100).required(),
    price : Joi.number().required(),
    size : Joi.string().required(),
    color : Joi.string().required()
});
export default ProductSchema;