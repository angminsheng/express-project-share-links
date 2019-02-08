const express = require('express')
const User = require('../models/User')
const Link = require('../models/Link')
const Like = require('../models/Like')
const { checkConnected } = require('../configs/middlewares')
const router = express.Router()

/* GET home page */
router.get('/', (req, res, next) => {
  
  Link.find()
  .then(links => {
      res.render('index', { 
        links,
        errorMessage: req.flash('errorMessage')[0]
      })
    })
    .catch(next)
})

router.post('/add-link', (req, res, next) => {
  if (!req.user) {
    req.flash('errorMessage', 'You need to be connected to add a link')
    res.redirect('/')
    return
  }

  Link.create({
    url: req.body.url,
    _owner: req.user._id
  })
  .then(() => {
    res.redirect('/')
  })
  .catch(err => {
    // Defines a variable `req.flash('errorMessage')[0]` for the next route
    req.flash('errorMessage', 'Please, give a URL that starts with "http://" or "https://')
    res.redirect('/')
  })
})

module.exports = router
