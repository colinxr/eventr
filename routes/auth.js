
const crypto    = require('crypto')
const Op        = require('Sequelize').Op
const router    = require('express').Router()
const passport  = require('passport')
const mail      = require('@sendgrid/mail')
const User      = require('../models/User')
const utils     = require('../utils/index.js')

mail.setApiKey(process.env.SENDGRID_API_KEY)

router.post('/register', async (req, res) => {
  // get the user details from req.body
  const {email, password, passwordConfirmation} = req.body 

  console.log(email, password)

  console.log('tk')

  if (
      email === undefined ||
      password === undefined ||
      passwordConfirmation === undefined
    ) {
      return utils.errorHandler('Not all fields were filled in', res)
    }

  if (password !== passwordConfirmation) {
    return utils.errorHandler('Password do not match', res)
  }

  try {
    const user = await User.create({ email, password })
    req.login(user, error => {
      console.log(user)
      if (error) {
        console.log(error)
        return utils.errorHandler(error, res)
      }
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ status: 'success', message: 'User Added' }))
      return 
    })
  } catch (error) {
    console.log('tk 4')
    const message = error.name === 'SequelizeUniqueConstraintError' ? 
      'User email already exists' : 
      'An error occured'
    return utils.errorHandler(message, res)
  }
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (error, user) => {
    if (error) {
      return  utils.errorHandler(error, res)
    }

    if (!user) {
      return utils.errorHandler('User does not exist', req, res)
    }

    req.logIn(user, error => {
      if (error) {
        return utils.errorHandler(error, res)
        
      }

      res.writeHead(200, {'Content-Type': 'application/json'})
      return res.end(JSON.stringify({status: 'success', message: 'Logged In'}))
    })
  })(req, res, next)
})

router.post('/logout', (req, res) => {
  req.logout()
  req.session.destroy()
  res.end(JSON.stringify({status: 'success', message: 'logged out'}))
  return 
})

router.post('/forgot', async (req, res) => {
  const {email} = req.body
  console.log(email)
  const resetToken = crypto.randomBytes(20).toString('hex')
  const resetTokenExpires = Date.now() + 3600000

  try {
    const user = await User.findOne({ where: { email }})
    
    if (!user) {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ status: 'error', message: 'No user found' }))
      return
    }
    
    user.update({resetToken, resetTokenExpires}) 

    // send email
    const msg = {
      to: email,
      from: process.env.EMAIL,
      subject: 'Password Reset',
      text: `
      You are receiving this because you (or someone else) have requested the reset of the password for your account.
      Please click on the following link, or paste this into your browser to complete the process:
      http://${process.env.BASE_URL}/reset/${resetToken}
      If you did not request this, please ignore this email and your password will remain unchanged.
    `,
    }

    mail.send(msg);

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok', message: 'Password reset link sent' }))
  } catch (error) {
    console.log(error)
    utils.errorHandler(error, res)
  }
})

router.post('/reset/:token', async (req, res) => {
  const { password } = req.body
  const resetToken = req.params.token

  try {
    const user = await User.findOne({
      where: {
        resetToken,
        resetTokenExpires: { [Op.gt]: Date.now() }
      }
    })

    if (!user) {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ status: 'error', message: 'No user found' }))
      return
    }
    
    user.update({ password, resetToken: null, resetTokenExpires: null })

    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(JSON.stringify({status: 'success', message: 'Password reset'}))
  } catch (error) {
    console.log(error)
    utils.errorHandler(error, res)
  }
})

module.exports = router 