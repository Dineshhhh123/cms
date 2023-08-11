import { Request, Response } from 'express';
import Order from '../models/order';
import Product from '../models/product';
import User from '../models/user';
import { Op } from 'sequelize'; 
import Wishlist from '../models/Wishlist';
import { authenticate } from '../middleware/auth';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, specifications } = req.body;
    const product = await Product.create({ name, description, price, specifications });
    res.status(201).json(product);
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ error: 'Failed to add product.' });
  }
};
export const updateOrder = async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.order_id);

  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      res.status(404).json({ error: 'Order not found.' });
    } else {
      await order.update(req.body);
      res.status(200).json({ message: 'Order updated successfully.' });
    }
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ error: 'Failed to update order.' });
  }
};


export const addToWishlist = async (req: Request, res: Response) => {
  const { userId, productId } = req.body;

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    const existingWishlistItem = await Wishlist.findOne({
      where: {
        userId: user.id,
        productId: product.id,
      },
    });

    if (existingWishlistItem) {
      res.status(409).json({ error: 'Product already exists in the wishlist.' });
      return;
    }

    await Wishlist.create({ userId: user.id, productId: product.id });

    res.status(200).json({ message: 'Product added to wishlist successfully.' });
  } catch (err) {
    console.error('Error adding product to wishlist:', err);
    res.status(500).json({ error: 'Failed to add product to wishlist.' });
  }
};


