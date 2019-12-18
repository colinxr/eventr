const Sequelize = require('sequelize')
const sequelize = require('../config/database')
const Event     = require('./Event')

class Guest extends Sequelize.Model { }

Guest.init({
  id: {
    type: Sequelize.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  event_id: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Event,
      key: 'id',
    }
  },
  name: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  company: {
    type: Sequelize.DataTypes.STRING,
    allowNull: true
  },
  category: {
    type: Sequelize.DataTypes.STRING,
    allowNull: true
  },
  postal: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  instagram: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'guest'
})

module.exports = Guest