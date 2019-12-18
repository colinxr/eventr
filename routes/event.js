const fs        = require('fs')
const router    = require('express').Router()
const passport  = require('passport')
const multer    = require('multer')
const csv       = require('fast-csv')
const User      = require('../models/User')
const List      = require('../models/List')
const Event     = require('../models/Event')
const Invite    = require('../models/Invite')
const Guest = require('../models/Guest')
const utils     = require('../utils/index')

const upload    = multer({dest: '/tmp/csv/'})

router.post('/new', utils.isAuthenticated, async (req, res) => {
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
      'Event already exists with that name' :
      'An error occured'
    utils.errorHandler(message, res)
  }
})

router.get('/:id', async (req, res) => {
  const eventId = req.params.id 

  Event.findByPk(eventId)
    .then(event => {
      if (!event) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ status: 'error', message: 'Event not found' }))
        return
      }

      res.writeHead(200, {'Content-Type': 'application/json'})
      res.end(JSON.stringify(event.dataValues))
    })
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
        .catch(err =>  utils.errorHandler(err, res) )
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
        { status: false }, 
        { where: { id: eventData.id } }
      )
      .then(() => {
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify({status: 'success', message: 'Event Archived'}))
      })
      .catch(err => utils.errorHandler(err, res))
    })
})

router.get('/:id/list', async (req, res) => {
  const event_id = req.params.id 

  try {
    List.findOne({ where: { event_id } })
      .then(async list => {
        console.log(list)
        const list_id = list.dataValues.id
        try {
          const invites = await Invite.findAll({ where: { list_id } })

          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify(invites))
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ status: 'error', message: error.name }))
        }
      })
  } catch (err) { 
    utils.errorHandler(err, res) 
  }
})

router.post('/:id/list', upload.single('csv'), async(req, res) => {
  const file = req.file 
  const eventId = req.params.id

  if (!file) {
    res.writeHead(500, {'Content-Type': 'application/json'})
    res.end(JSON.stringify({status: 'error', message: 'No File uploaded'}))
    return 
  }

  try {
    List.findOrCreate({ 
      where: { event_id: eventId }, 
      defaults: { event_id: eventId }
    })
    .then(data => {
      const listId = data[0].dataValues.id

      fs.createReadStream(file.path)
        .pipe(csv.parse({ headers: true }))
        .on('data', async row => {
          try {
            row.list_id = listId
            const invite = await Invite.create(row)
          } catch (error) {
            utils.errorHandler(error, res)
          }
        })
        .on('end', () => {
          Event.update({list_id: listId}, {where: {id: eventId}})

          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ status: 'ok', message: 'Invites uploaded' }))
        }) 
      })
  } catch (error) {
    utils.errorHandler(error, res)
  }
})

router.post('/:id/guest/new', async (req, res) => {
  const event_id = req.params.id
  const { name, email, postal, instagram, guestName } = req.body.guest

  try {
    const event = await Event.findByPk(event_id)

    const invite = await Invite.findOne({
      where: {
        email: email,
        list_id: event.list_id
      }
    })

    try {
      const guestData = {
        name,
        email,
        postal,
        instagram,
        guestName,
        status: invite ? 'approved' : 'unknown',
        event_id: event.id
      }

      if (invite) {
        const { company, category } = invite.dataValues
        guestData.company = company
        guestData.category = category
      }

      console.log(guestData)

      const guest = await Guest.create(guestData)

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ status: 'success', message: 'Guest added' }))
    } catch (error) {
      console.log(error)
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ status: 'error', message: error.name }))
      return
    }
  } catch (error) {
    console.log(error)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'error', message: error.name }))
  }
})

module.exports = router