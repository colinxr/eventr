const Sequelize = require('sequelize')
const sequelize = require('../config/database')
const List      = require('./List')

class Invite extends Sequelize.Model { }

Invite.init({
  id: {
    type: Sequelize.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  list_id: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: List,
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
  }
}, {
  sequelize,
  modelName: 'invite'
})

module.exports = Invite