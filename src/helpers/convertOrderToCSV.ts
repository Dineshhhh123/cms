import Order from '../models/order';


export const convertOrdersToCSV = (orders: Order[]): string => {
    const csvHeaders = 'Order ID,User ID,Product ID,Quantity,Payment Details\n';
    const csvRows = orders
      .map(
        (order) =>
          `${order.id},${order.userId},${order.productId},${order.quantity},"${order.paymentDetails}"\n`
      )
      .join('');
  
    return csvHeaders + csvRows;
  };