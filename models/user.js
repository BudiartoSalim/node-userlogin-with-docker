'use strict';
const bcrypt = require('bcryptjs');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    username: {
      type: DataTypes.STRING, allowNull: false, unique: true,
      validate: {
        notNull: { args: true, msg: "Username must not be empty." },
        len: {
          args: [4, 50],
          msg: "Username must be between 4 to 50 characters long."
        }
      }
    },
    email: {
      type: DataTypes.STRING, allowNull: false, unique: true,
      validate: {
        notNull: { args: true, msg: "Email is unavailable." }
      },
      is: {
        args: /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2.4}$/i,
        msg: "Must be in email format."
      }
    },
    password: {
      type: DataTypes.STRING, allowNull: false,
      validate: {
        notNull: { args: true, msg: "Password cannot be empty." },
        len: {
          args: [4, 50],
          msg: "Password must be between 4 to 50 characters long."
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.addHook('beforeBulkCreate', (data) => {
    data.forEach((el) => {
      const salt = bcrypt.genSaltSync(10);
      el.password = bcrypt.hashSync(el.password, salt);
    })
  })

  User.addHook('beforeCreate', (data) => {
    const salt = bcrypt.genSaltSync(10);
    data.password = bcrypt.hashSync(data.password, salt);
  })

  return User;
};