module.exports = {
  checkConnected: (req,res,next) => {
    if (req.user) {
      next()
    }
    else {
      res.redirect('/auth/login')
    }
  }
}