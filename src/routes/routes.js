const router = require('express').Router()

const auth = require('./auth')
const product = require('./product')
const order = require('./order')

router.use('/auth', auth)
router.use('/product', product)
router.use('/purchase', order)

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: false,
    message: err.message
  })
})

module.exports = router
