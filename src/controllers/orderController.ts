import { Request, Response } from 'express';
import { Op } from 'sequelize'; 
import Order from '../models/order';
import User from '../models/user';
import Helper from '../helpers/helper';
const helper = new Helper();

class orderController{
  placeOrder = async (req: Request, res: Response) => {
    try {
      const { userId, productId, quantity, paymentDetails } = req.body;
  
      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found.' });
        return;
      }
  
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const fiveProductPurchaseToday = await Order.count({
        where: { userId: userId, createdAt: { [Op.gte]: today } },
      });
  
      if (fiveProductPurchaseToday >= 5) {
        res.status(403).json({ error: 'You can only buy a maximum of 5 products per day.' });
        return;
      }
  
      const order = await Order.create({ userId, productId, quantity, paymentDetails });
      console.log(order.id)
  
      res.status(201).json(order);
      
        const  orderId  = order.id;
      await helper.invoice(orderId);
        
      
    } catch (err) {
      console.error('Error placing order:', err);
      res.status(500).json({ error: 'Failed to place order.' });
    }
  };

}


export default orderController;

