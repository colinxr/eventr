
const dotenv         = require('dotenv')
const morgan         = require('morgan')
const port           = parseInt(process.env.PORT, 10) || 3001
const dev            = process.env.NODE_env !== 'production'
dotenv.config()

const express        = require('express')
const session        = require('express-session')
const cors           = require('cors')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const bodyParser     = require('body-parser')
const cookieParser   = require('cookie-parser')
const passport       = require('passport')
const LocalStrategy  = require('passport-local').Strategy

const sequelize      = require('./config/database.js')
const User           = require('./models/User')
const Event          = require('./models/Event')
const List           = require('./models/List')
const Invite         = require('./models/Invite')
const Guest          = require('./models/Guest')

const authRoutes     = require('./routes/auth')
const eventRoutes    = require('./routes/event')
const guestRoutes    = require('./routes/guest')

const utils          = require('./utils/index')

const sessionStore = new SequelizeStore({
  db: sequelize
})

sessionStore.sync()

User.sync({alter: true})
Event.sync({ alter: true })
List.sync({ alter: true })
Invite.sync({ alter: true })
Guest.sync({ alter: true })

// require('./config/passport')(passport)  // pass passport for configuration
passport.serializeUser((user, done) => {
  done(null, user.email)
})

passport.deserializeUser(async (email, done) => {
  const user = await User.findOne({ where: { email } })
  done(null, true)
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


const app = express()

app.use(morgan('combined'))
app.use(cookieParser(process.env.APP_SECRET))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// set up session info
app.use(
  session({
    secret: process.env.APP_SECRET,
    name: 'eventr',
    resave: true,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      secure: false,
      maxAge: 8 * 60 * 60 * 1000
    },
    store: sessionStore,
  }),
)
app.use(passport.initialize())
app.use(passport.session())

app.use('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
})


/*------------------------------------*
//
//  Route Handlers
//
/*------------------------------------*/
app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/guests', guestRoutes)

// Launch app
app.listen(port, err => {
  if (err) throw err
  console.log('>>> here we go!')
  console.log(`> Ready on http://localhost:${port}`)
})
