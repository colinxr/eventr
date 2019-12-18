const router    = require('express').Router()
const Guest     = require('../models/Guest')
const utils     = require('../utils')


router.get('/:id', utils.isAuthenticated, async (req, res) => {
  const { id } = req.params

  try {
    Guest.findOne({ where: { id } })

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'success', message: 'Guest details updated' }))
  } catch (error) {
    utils.errorHandler(error, res)
  }
})

router.put('/:id', utils.isAuthenticated, async (req, res) => {
  const userData = req.body.user 
  const { id } = req.params 

  try {
    Guest.update(userData, {where: { id }})
   
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(JSON.stringify({status: 'success', message: 'Guest details updated'}))
  } catch (error) {
    utils.errorHandler(error, res)
  }
})

router.put('/:id/approve', utils.isAuthenticated, async (req, res) => {
  const { id } = req.params

  try {
    Guest.update({ status: 'approved' }, { where: { id } })

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'success', message: 'Guest approved' }))
  } catch (error) {
    console.log(error)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'error', message: error.name }))
  }
})

router.put('/:id/deny', utils.isAuthenticated, async (req, res) => {
  const { id } = req.params

  try {
    Guest.update({ status: 'denied' }, { where: { id }})
    
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'success', message: 'Guest denied' }))
  } catch (error) {
    console.log(error)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'error', message: error.name }))
  }
})

router.delete('/:id', utils.isAuthenticated, async (req, res) => {
  const { id } = req.params
  try {
    Guest.destroy({ where: { id }})
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(JSON.stringify({status: 'success', message: 'User deleted'}))
  } catch (error) {
    utils.errorHandler(error, res)
  }
})

module.exports = router