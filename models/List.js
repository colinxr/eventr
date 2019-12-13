const Sequelize = require('sequelize')
const sequelize = require('../config/database')

class List extends Sequelize.Model { }

List.init({
  id: {
    type: Sequelize.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  count: {
    type: Sequelize.DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'list'
})

module.exports = List