import { Model, DataTypes } from 'sequelize';
import sequelize from '../helpers/helper';

class Session extends Model {
  public id!: number;
  public userId!: number;
  public token!: string;


  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Session.init(
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
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'sessions',
  }
);

export default Session;
