const errorHandler = (err, res) => {
  res.statusCode = 500
  res.end(JSON.stringify({ status: 'error', message: err }))
  return
}

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  return res.redirect('/login')
}

module.exports = { errorHandler, isLoggedIn }