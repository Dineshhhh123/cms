import express from 'express';

import ReportController from '../controllers/reportController';
const reportController = new ReportController();
const router = express.Router();

router.get('/api/reports/purchased-orders', reportController.generateCSVReport);

export default router;