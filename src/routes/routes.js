const router = require('express').Router()

const auth = require('./auth')

router.use('/auth', auth)

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: false,
    message: err.message
  })
})

module.exports = router
