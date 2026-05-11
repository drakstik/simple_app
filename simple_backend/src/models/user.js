'use strict';
import { Model } from 'sequelize';
import argon2 from 'argon2';


/**
 * @typedef {Object} UserAttributes
 * @property {string} id
 * @property {string|null} username
 * @property {string} password
 */

/**
 * This tells TypeScript which attributes are optional during .create()
 * @typedef {import('sequelize').Optional<UserAttributes, 'id' | 'username'>} UserCreationAttributes
 */


/**
 * @extends {Model<UserAttributes, UserCreationAttributes>}
 */
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

  async validPassword(password) {
    return await argon2.verify(this.password, password)
  }
}

export default (sequelize, DataTypes) => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: 'User',
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            // Argon2 handles the salt automatically
            user.password = await argon2.hash(user.password, {
              type: argon2.argon2id, // Hybrid mode: best of both worlds
              memoryCost: 2 ** 16,   // 64MB
              timeCost: 3,           // 3 iterations
              parallelism: 1
            });
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed('password')) {
            user.password = await argon2.hash(user.password);
          }
        }
      },
      // defaultScope belongs here, not inside 'options'
      defaultScope: {
        attributes: { exclude: ['password'] },
      }
    });
  return User;
};