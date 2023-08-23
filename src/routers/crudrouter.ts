import express from 'express';
import CrudController from '../controllers/crudController';
import { authenticate } from '../middleware/auth';
const crudController = new CrudController();
const router = express.Router();

router.post('/api/products',authenticate, crudController.createProduct);



router.get('/api/users', authenticate, crudController.getall);



router.put('/api/orders/:order_id', authenticate,crudController.updateOrder);
router.post('/api/wishlist',authenticate, crudController.addToWishlist);




export default router;