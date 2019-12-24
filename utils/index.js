const passport = require('passport')

const errorHandler = (err, res) => {
  res.statusCode = 500
  return res.end(JSON.stringify({ status: 'error', message: err.name }))
}
const isAuthenticated = (req, res, next) => {

  if (req.isAuthenticated()) return next()
  
  res.writeHead(403, {'Content-Type': 'application/json'})
  res.end(JSON.stringify({status: 'error', message: 'You are not logged in'}))
}

module.exports = { errorHandler, isAuthenticated }