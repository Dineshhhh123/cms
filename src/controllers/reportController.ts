import { Request, Response } from 'express';
import { Op } from 'sequelize'; 

import fs from 'fs';
import Order from '../models/order';
import User from '../models/user';
import Product from '../models/product';

export const generateCSVReport = async (req: Request, res: Response) => {
  const { startTime, endTime} = req.query;

  try {
    const orders = await Order.findAll({
      where: { createdAt: { [Op.between]: [startTime, endTime] } },
      include: [
        { model: User, as: 'User' }, 
        { model: Product, as: 'Product' }
      ],
    });
    

    const csvData = convertOrdersToCSV(orders); 
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
const convertOrdersToCSV = (orders: Order[]): string => {
    const csvHeaders = 'Order ID,User ID,Product ID,Quantity,Payment Details\n';
    const csvRows = orders
      .map(
        (order) =>
          `${order.id},${order.userId},${order.productId},${order.quantity},"${order.paymentDetails}"\n`
      )
      .join('');
  
    return csvHeaders + csvRows;
  };