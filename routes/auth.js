const router    = require('express').Router()
const passport  = require('passport')
const User      = require('../models/User')
const sequelize = require('../config/database')
const utils = require('../utils/index.js')

router.post('/register', async (req, res) => {
  // get the user details from req.body
  const {email, password, passwordConfirmation} = req.body 

  if (password !== passwordConfirmation) {
    utils.errorHandler('Password do not match', res)
    return 
  }

  try {
    const user = await User.create({ email, password })
    req.login(user, error => {
      if (error) {
        console.log(error)
        errorHandler(error, res)
        return
      }

      res.end(JSON.stringify({status: 'success', message: 'User Added'}))
      return 
    })
  } catch (error) {
    const message = error.name === 'SequelizeUniqueConstraintError' ? 
      'User email already exists' : 
      'An error occured'
    utils.errorHandler(message, res)
  }
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (error, user) => {
    if (error) {
      utils.errorHandler(error, res)
      return 
    }

    if (!user) {
      utils.errorHandler('User does not exist', req, res)
      return 
    }

    req.logIn(user, error => {
      if (error) {
        utils.errorHandler(error, res)
        return 
      }

      res.end(JSON.stringify({status: 'success', message: 'Logged In'}))
      return
    })

  })(req, res, next)
})

router.post('/logout', (req, res) => {
  req.logout()
  req.session.destroy()
  res.end(JSON.stringify({status: 'success', message: 'logged out'}))
  return 
})

module.exports = router 