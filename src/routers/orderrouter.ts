import express from 'express';
import OrderController from '../controllers/orderController';
const orderController = new OrderController();
const router = express.Router();
import { authenticate } from '../middleware/auth';


router.post('/api/orders',authenticate, orderController.placeOrder);
router.post('/api/multipleorders',authenticate, orderController.multipleorder);
export default router;
