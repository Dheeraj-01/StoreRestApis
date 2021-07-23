import { Product } from "../../modals";
import multer from "multer";
import { CustomErrorHandler } from "../../services";
import path from 'path';
import fs from 'fs';
import ProductSchema from "../../Validations/ProductSchema";

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${path.extname(file.originalname)}`;
        // 3746674586-836534453.png
        cb(null, uniqueName);
    },
});

const handleMultipartData = multer({
    storage,
    limits: { fileSize: 1000000 * 5 },
}).single('image'); // 5mb



const CreateProductController = {
    async add(req, res, next){
        // store multiform Data by use of Multer
         handleMultipartData(req, res ,async (err)=>{
            if(err){
                return next(CustomErrorHandler.serverError(err.message));
            }
            // console.log(req.file);
            let filepath = req.file.destination+""+req.file.filename;
            const {error} = ProductSchema.validate(req.body);
            if(error){
                // Delete the uploaded file
                fs.unlink(`${appRoot}/${filepath}`, (err) => {
                    if (err) {
                        return next(
                            CustomErrorHandler.serverError(err.message)
                        );
                    }
                });

                return next(error);
                // rootfolder/uploads/filename.png
            }

            const {name , price , size , color} = req.body;
            let document;
            try{
                document = await Product.create({
                    name,
                    price,
                    size,
                    color,
                    image: filepath
                });
            }
            catch(err){
                next(err);
            }
            res.status(201).json(document);
        });
    },
    async update(req, res, next){
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }
            let filePath;
            if (req.file) {
                filePath = req.file.destination+""+req.file.filename;
            }

            // validation
            // console.log(req.body);
            const { error } = ProductSchema.validate(req.body);
            // console.log(error);
            if (error) {
                // Delete the uploaded file
                if (req.file) {
                    fs.unlink(`${appRoot}/${filePath}`, (err) => {
                        if (err) {
                            return next(
                                CustomErrorHandler.serverError(err.message)
                            );
                        }
                    });
                }

                return next(error);
                // rootfolder/uploads/filename.png
            }

            const { name, price, size, color } = req.body;
            let document;
            try {
                // console.log(req.params.id);
                document = await Product.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        name,
                        price,
                        size,
                        color,
                        ...(req.file && { image: filePath }),
                    },
                    { new: true }
                );
            } catch (err) {
                return next(err);
            }
            res.status(201).json(document);
        });
    },
    async distroy(req, res, next){
        const document = await Product.findOneAndRemove({ _id: req.params.id });
        if (!document) {
            return next(new Error('Nothing to delete'));
        }
        // image delete
        const imagePath = document._doc.image;
        // http://localhost:5000/uploads/1616444052539-425006577.png
        // approot/http://localhost:5000/uploads/1616444052539-425006577.png
        fs.unlink(`${appRoot}/${imagePath}`, (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError());
            }
            return res.json(document);
        });
    },
    async store(req, res, next){
        let document; 
        try{
            document = await Product.find().select('-updatedAt -__v');
        }
        catch(err){
            return next(CustomErrorHandler.serverError());
        }
        res.json(document);
    },
    async storeItem(req, res , next){
        let document; 
        try{
            document = await Product.findOne({_id : req.params.id}).select('-updatedAt -__v');
        }
        catch(err){
            return next(CustomErrorHandler.serverError());
        }
        res.json(document);
    }
}
export default CreateProductController;