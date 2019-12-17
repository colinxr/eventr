const router = require('express').Router()
const passport = require('passport')
const User = require('../models/User')
const Event = require('../models/Event')
const sequelize = require('../config/database')
const utils = require('../utils/index')

router.post('/new', async (req, res) => {
  const {slug, title, venue, list_id} = req.body.event 

  try {
    const event = await Event.create({slug, title, venue, list_id})

    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(JSON.stringify({
      status: 'success', 
      message: 'Event created',
    }))
    
  } catch (error) {
    const message = error.name === 'SequelizeUniqueConstraintError' ?
      'User email already exists' :
      'An error occured'
    utils.errorHandler(message, res)
  }
})

router.put('/:id/edit', async (req, res) => {
  const eventId = req.params.id
  const eventData = req.body.event 
  
  Event.findByPk(eventId)
    .then(event => {
      if (!event) {
        res.writeHead(404, {'Content-Type': 'application/json'})
        res.end(JSON.stringify({ status: 'error', message: 'Event not found'}))
        return
      }

      Event.update(eventData, { where: { id: eventId } })
        .then(() => {
          res.writeHead(200, {'Content-Type': 'application/json'})
          res.end(JSON.stringify({status: 'success', message:'Event Updated'}))
        })
        .catch(err => {
          res.writeHead(500, {'Content-Type': 'application/json'})
          res.end(JSON.stringify({status: 'error', message: err.name}))
        })
    })
})

router.put('/:id/archive', async(req, res) => {
  const eventId = req.params.id

  Event.findByPk(eventId)
    .then(event => {
      if (!event) {
        res.writeHead(404, {'Content-Type': 'application/json'})
        res.end(JSON.stringify({status: 'error', message: 'Event not found'}))
      }

      Event.update(
        {status: false}, 
        { where: {id: eventData.id} }
      )
      .then(() => {
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify({status: 'success', message: 'Event Archived'}))
      })
      .catch(err => {
        res.writeHead(500, {'Content-Type': 'application/json'})
        res.end(JSON.stringify({status: 'error', message: err.name}))
      })
    })
})

module.exports = router