
const { DataTypes, Model } = require('sequelize');
import sequelize from '../config/db';

class Wishlist extends Model {}

Wishlist.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize, 
    modelName: 'wishlist', 
    timestamps: false, 
    tableName: 'wishlists', 
  }
);

export default Wishlist;
