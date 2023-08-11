import { Model, DataTypes } from 'sequelize';
import sequelize from '../helpers/helper';
import User from './user'; 
import Product from './product';

class Order extends Model {
  public id!: number;
  public userId!: number;
  public productId!: number;
  public quantity!: number;
  public paymentDetails!: string;


  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    paymentDetails: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'orders',
  }
);

Order.belongsTo(User, {
  foreignKey: 'userId', 
  as: 'User',
});
Order.belongsTo(Product, {
  foreignKey: 'productId', 
  as: 'Product', 
});

export default Order;
