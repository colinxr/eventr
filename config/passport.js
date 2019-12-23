const LocalStrategy = require('passport-local').Strategy

const User = require('../models/User.js')

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.email)
  })

  passport.deserializeUser(async (email, done) => {
    try {
      const user = await User.findOne({ where: { email } })
      done(null, user.email)
    } catch (error) {
      done(error)
    }
  })

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async function (email, password, done) {
    if (!email || !password) {
      done('email and password required', null);
      return
    }

    const user = await User.findOne({ where: { email } })

    if (!user) {
      done('User not found', null);
      return
    }

    const valid = await user.isPasswordValid(password)

    if (!valid) {
      done('email and password do not match', null);
      return
    }

    done(null, user);
  }))
}