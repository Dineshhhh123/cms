import express from 'express';

import AuthController  from '../controllers/userController';
const router = express.Router();

const authController = new AuthController();

router.get('/api/users/:user_id', authController.getUserById);
router.post('/api/login', authController.login); 
router.post('/api/register', authController.registerUser);
router.get('/auth/google', authController.socialLoginGmail);
router.get('/auth/google/callback', authController.socialLoginGmailCallback, authController.socialLoginGmailCallbackSuccess);
export default router;
