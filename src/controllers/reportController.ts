import { Request, Response } from 'express';
import { Op } from 'sequelize'; 

import fs from 'fs';
import Order from '../models/order';
import User from '../models/user';
import Product from '../models/product';
import orderController from './orderController';
import Helper from '../helpers/helper';
const helper = new Helper();

class ReportController{
  generateCSVReport = async (req: Request, res: Response) => {
    const { startTime, endTime} = req.query;
  
    try {
      const orders = await Order.findAll({
        where: { createdAt: { [Op.between]: [startTime, endTime] } },
        include: [
          { model: User, as: 'User' }, 
          { model: Product, as: 'Product' }
        ],
      });
      
  
      const csvData = helper.convertOrdersToCSV(orders); 
      const fileName = 'purchased_orders_report.csv';
      fs.writeFileSync(fileName, csvData, 'utf8');
  
      res.download(fileName, () => {
        fs.unlinkSync(fileName);
      });
    } catch (err) {
      console.error('Error generating CSV report:', err);
      res.status(500).json({ error: 'Failed to generate CSV report.' });
    }
  };
  

}
export default ReportController;