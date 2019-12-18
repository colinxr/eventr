const bcrypt = require('bcrypt')
const Sequelize = require('sequelize')
const sequelize = require('../config/database')

class User extends Sequelize.Model{}

User.init({
  email: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  resetToken: {
    type: Sequelize.DataTypes.STRING,
    allowNull: true
  },
  resetTokenExpires: {
    type: Sequelize.DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'user',
  timestamps: true,
  hooks: {
    beforeCreate: async user => {
      const salt = await bcrypt.genSalt(12) // generate salt at 10 rounds 
      user.password = await bcrypt.hash(user.password, salt) // replace users plain text password with newly created salt 
    },
    beforeUpdate: async user => {
      const salt = await bcrypt.genSalt(12)
      user.password = await bcrypt.hash(user.password, salt)
    }
  }
})

User.prototype.isPasswordValid = async function(password) {
  return await bcrypt.compare(password, this.password)
}

module.exports = User