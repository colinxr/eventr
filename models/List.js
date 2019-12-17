const Sequelize = require('sequelize')
const sequelize = require('../config/database')
const Event     = require('./Event')

class List extends Sequelize.Model { }

List.init({
  id: {
    type: Sequelize.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  event_id: {
    type: Sequelize.DataTypes.INTEGER,
    references: {
      model: Event, 
      key: 'id',
    }
  }
}, {
  sequelize,
  modelName: 'list'
})

module.exports = List