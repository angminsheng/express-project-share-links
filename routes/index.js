const express = require('express')
const User = require('../models/User')
const Link = require('../models/Link')
const Like = require('../models/Like')
const { checkConnected } = require('../configs/middlewares')
const router = express.Router()

// // Simple Home Page
// router.get('/', (req, res, next) => {
//   Link.find().populate('_owner')
//     .then(links => {
//       res.render('index', {
//         links,
//         errorMessage: req.flash('errorMessage')[0]
//       })
//     })
//     .catch(next)
// })

// Complete Home Page
router.get('/', (req, res, next) => {
  Promise.all([
    Link.find().populate('_owner').lean(), // .lean() converts documents into simple plain objects 
    Like.find({ _user: req.user && req.user._id }).lean()
  ])
    .then(([links, likes]) => {
      res.render('index', {
        links: links.map(link => ({
          ...link,
          isLiked: likes.some(like => like._link.equals(link._id)) // .some(....) returns true if 1 item is true
        })),
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

// The following route is protected thanks to checkConnected
router.get('/profile', checkConnected, (req, res, next) => {
  Promise.all([
    Link.find({ _owner: req.user._id }),
    Like.find({ _user: req.user._id }).populate('_link')
  ])
    .then(([links, likes]) => {
      res.render('profile', {
        user: req.user,
        links,
        likes
      })
    })
})

router.get('/like-link/:linkId', checkConnected, (req, res, next) => {
  let { linkId } = req.params
  let potentialLike = {
    _user: req.user._id,
    _link: req.params.linkId
  }
  // First, check if there is a link with linkId
  Link.findById(linkId)
    .then(link => {
      console.log("DEBUG 1")

      if (!link) {
        res.redirect('/')
      }
      return Like.findOne(potentialLike)
    })
    .then(like => {
      console.log("DEBUG 2", like)

      // If we find a link, we remove the like
      if (like) {
        console.log("DEBUG 2a")
        return Like.findByIdAndDelete(like._id)
      }
      // Else, we create the like
      else {
        console.log("DEBUG 2b")
        return Like.create(potentialLike)
      }
    })
    .then(() => {
      console.log("DEBUG 3")

      res.redirect('/')
    })
    .catch(next)
})

router.get('/delete-link/:linkId', checkConnected, (req, res, next) => {
  // To delete a link, we must delete the link and also all the likes related to the link
  let { linkId } = req.params
  Promise.all([
    Link.findByIdAndDelete(linkId),
    Like.deleteMany({ _link: linkId })
  ])
    .then(() => {
      res.redirect('/profile')
    })
    .catch(next)
})

module.exports = router
