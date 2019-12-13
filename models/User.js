const bcrypt = require('bcrypt')
const Sequelize = require('sequelize')
const sequelize = require('../config/database')

class User extends Sequelize.Model{}

User.init({
  email: {
    tyep: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'user',
  timestamps: true,
  hooks: {
    beforeCreate: async user => {
      const salt = await bcrypt.genSalt(10) // generate salt at 10 rounds 
      user.password = await bcrypt.hash(user.password, salt) // replace users plain text password with newly created salt 
    }
  }
})

User.prototype.isPasswordValid = async function(password) {
  return await bcrypt.compare(passowrd, this.password)
}

module.exports = User