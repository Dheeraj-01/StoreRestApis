import express from 'express';
import {registerController, loginController, UserConroller, CreateProductController} from '../Controllers';
const router = express.Router();

router.post('/register',registerController.register);
router.post('/login',loginController.login);
router.post('/',UserConroller.valid);
router.post('/logout',loginController.logout);


router.post('/addProduct',CreateProductController.add);
router.put('/updateProduct/:id',CreateProductController.update);
router.delete('/deleteProduct/:id',CreateProductController.distroy);


router.get('/produts',CreateProductController.store);
router.get('/produts/:id',CreateProductController.storeItem);



export default router;