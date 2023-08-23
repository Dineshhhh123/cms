import express from 'express';

import SuperAdminController from '../controllers/superAdminController';
const superAdminController = new SuperAdminController();
import { authenticate } from '../middleware/auth';

const router = express.Router();


router.post('/api/super-admin', superAdminController.createSuperAdmin);
router.post('/api/staff',authenticate, superAdminController.createStaffMembers);

export default router;