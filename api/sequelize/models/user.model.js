const { DataTypes } = require('sequelize')
const bcrypt = require('bcrypt')

module.exports = (sequelize) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      username: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
        validate: {
          is: /^\w{3,}$/,
        },
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          const salt = await bcrypt.genSalt(10)
          user.password = await bcrypt.hash(user.password, salt)
        },
        beforeUpdate: async (user) => {
          const salt = await bcrypt.genSalt(10)
          user.password = await bcrypt.hash(user.password, salt)
        },
      },
      scopes: {
        public: {
          attributes: { exclude: ['password', 'updatedAt', 'email'] },
        },
      },
    }
  )

  User.prototype.validPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword)
  }
}
