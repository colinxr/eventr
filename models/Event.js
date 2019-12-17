const Sequelize = require('sequelize')
const sequelize = require('../config/database')

class Event extends Sequelize.Model { }

Event.init({
  id: {
    type: Sequelize.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  list_id: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: true,
  },
  slug: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  venue: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  active: {
    type: Sequelize.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true, 
  }
}, {
  sequelize,
  modelName: 'event'
})

module.exports = Event