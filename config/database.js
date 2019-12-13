const dotenv = require('dotenv')
const Sequelize = require('sequelize')

dotenv.config()

const user = process.env.DB_USER
const password = process.env.DB_PASS
const host = process.env.DB_HOST
const database = process.env.DB_NAME

const sequelize = new Sequelize(database, user, password, {
  host, 
  dialect: 'postgres',
  logging: false
})

module.exports = sequelize