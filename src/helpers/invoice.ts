import Order from '../models/order';
import * as nodemailer from 'nodemailer';
import User from '../models/user';
import Product from '../models/product';

export const invoice = async (orderId:number)=>{
    try {
      const order = await Order.findByPk(orderId, { include: [{ model: User, as: 'User'}, { model: Product, as: 'Product'}] });
      if (!order) {
        return({ error: 'Order not found.' });
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
            user: process.env.MAILER,
            pass: process.env.MAILER_PASS
      }
      });
  
      const mailOptions = {
        from: process.env.MAILER,
        to: userEmail,
        subject: 'Purchase Invoice',
        text: `Thank you for your purchase! Here is your invoice:\n\nProduct: ${productDetails}\n\nQuantity:${quantity}\n\nPrice:${price}...`,
        
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending purchase invoice:', error);
          return({ error: 'Failed to send purchase invoice.' });
        } else {
          console.log('Purchase invoice sent:', info.response);
          return({ message: 'Purchase invoice sent successfully.' });
        }
      });
    } catch (err) {
      console.error('Error sending purchase invoice:', err);
      return({ error: 'Failed to send purchase invoice.' });
    }
  }