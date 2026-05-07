/* eslint-disable @typescript-eslint/no-require-imports */
'use strict';
import { Model } from 'sequelize';

export class User extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static associate(models) {
    // define association here
  }
}

export default (sequelize, DataTypes) => {
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};