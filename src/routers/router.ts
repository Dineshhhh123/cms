import express from 'express';
import { placeOrder } from '../controllers/orderController';
import { createSession, registerUser,login ,getUserById} from '../controllers/authController';
import { updateOrder, addToWishlist,createProduct } from '../controllers/crudController';
import { generateCSVReport } from '../controllers/reportController';
import { createSuperAdmin , createStaffMembers } from '../controllers/superAdminController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/api/products',authenticate, createProduct);

router.post('/api/orders',authenticate, placeOrder);

router.get('/api/users/:user_id', getUserById);

router.post('/api/sessions', authenticate,createSession);

router.post('/api/login', login); 
router.post('/api/register', registerUser);

router.put('/api/orders/:order_id', authenticate,updateOrder);
router.post('/api/wishlist',authenticate, addToWishlist);

router.get('/api/reports/purchased-orders',authenticate, generateCSVReport);
router.post('/api/super-admin', createSuperAdmin);
router.post('/api/staff',authenticate, createStaffMembers);



export default router;
