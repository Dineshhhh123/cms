import { Request, Response } from 'express';
import { Op } from 'sequelize'; 
import * as nodemailer from 'nodemailer';
import Order from '../models/order';
import User from '../models/user';
import Product from '../models/product';

export const placeOrder = async (req: Request, res: Response) => {
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
    
      try {
        const order = await Order.findByPk(orderId, { include: [{ model: User, as: 'User'}, { model: Product, as: 'Product'}] });
        if (!order) {
          res.status(404).json({ error: 'Order not found.' });
          return;
        }
        const data = await User.findByPk(order.userId);
        const data1 = await Product.findByPk(order.productId);
        const userEmail = data?.email
        const productDetails = data1?.name;
        const quantity = order.quantity;
        const price=data1?.price;
        
        const transporter = nodemailer.createTransport({
          service : 'gmail',
          auth : {
              user: 'dineshkumar170800@gmail.com',
              pass: 'oobyquodahpxbicw'
        }
        });
    
        const mailOptions = {
          from: 'dineshkumar170800@gmail.com',
          to: userEmail,
          subject: 'Purchase Invoice',
          text: `Thank you for your purchase! Here is your invoice:\n\nProduct: ${productDetails}\n\nQuantity:${quantity}\n\nPrice:${price}...`,
          
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending purchase invoice:', error);
            res.status(500).json({ error: 'Failed to send purchase invoice.' });
          } else {
            console.log('Purchase invoice sent:', info.response);
            res.status(200).json({ message: 'Purchase invoice sent successfully.' });
          }
        });
      } catch (err) {
        console.error('Error sending purchase invoice:', err);
        res.status(500).json({ error: 'Failed to send purchase invoice.' });
      }
    
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ error: 'Failed to place order.' });
  }
};
