import Order from '../models/order';
import * as nodemailer from 'nodemailer';
import User from '../models/user';
import Product from '../models/product';
import dotenv from 'dotenv';
dotenv.config();


class Helper{
    convertOrdersToCSV = (orders: Order[]): string => {
        const csvHeaders = 'Order ID,User ID,Product ID,Quantity,Payment Details\n';
        const csvRows = orders
          .map(
            (order) =>
              `${order.id},${order.userId},${order.productId},${order.quantity},"${order.paymentDetails}"\n`
          )
          .join('');
      
        return csvHeaders + csvRows;
      };



      sendInvitationEmail = async (email: string, generatedPassword: string) => {
        let config = {
          service : 'gmail',
          auth : {
              user: process.env.MAILER,
              pass: process.env.MAILER_PASS
          }
      }
      
      let transporter = nodemailer.createTransport(config);
      const message = {
           from: process.env.MAILER, 
           to: email,
           subject: 'Invitation to Join Our Team', 
           text: `Hello,\n\nYou are invited to join our team. Please find your login details below:\n\nEmail: ${email}\nPassword: ${generatedPassword}\n\nThank you!\nYour Team`, // Customize the email content
         };
      
      transporter.sendMail(message).then(() => {
          console.log( "you should receive an email")
      }).catch(error => {
          return error
      })
      } 



      generateRandomPassword = (length: number = 12) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        let password = '';
      
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          password += characters.charAt(randomIndex);
        }
      
        return password;
      };


      invoice = async (orderId:number)=>{
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

}
export default Helper;

