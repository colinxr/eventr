const port           = parseInt(process.env.PORT, 10) || 3000
const dev            = process.env.NODE_env !== 'production'
const dotenv         = require('dotenv');

const express        = require('express')
const session        = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const bodyParser     = require('body-parser')
const passport       = require('passport')

const sequelize      = require('./config/database.js')
const User           = require('./models/User')
const Event          = require('./models/Event')
const List           = require('./models/List')
const Invite         = require('./models/Invite')

const authRoutes     = require('./routes/auth');

const utils          = require('./utils/index')

dotenv.config()

const sessionStore = new SequelizeStore({
  db: sequelize
})

sessionStore.sync()

User.sync({alter: true})
Event.sync({ alter: true })
List.sync({ alter: true })
Invite.sync({ alter: true })

require('./config/passport')(passport);  // pass passport for configuration

const app = express()

// set up body-parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// set up session info
app.use(
  session({
    secret: process.env.APP_SECRET,
    resave: false,
    saveUninitialized: true,
    name: 'eventr',
    cookie: {
      secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1000
    },
    store: sessionStore,
  }),
  passport.initialize(),
  passport.session()
)

/*------------------------------------*
//
//  Route Handlers
//
/*------------------------------------*/
app.use(utils.errorHandler)

app.get('/', (req, res) => {
  res.end(JSON.stringify({message: 'hello fool!'}))
})

app.use('/api/auth', authRoutes)


// Launch app
app.listen(port, err => {
  if (err) throw err
  console.log('>>> here we go!')
  console.log(`> Ready on http://localhost:${port}`)
})

