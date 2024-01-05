const router = require('express').Router()
const authController = require('../controllers/auth')
const auth = require('../middleware/auth')

router.post('/signin', authController.signIn)
router.post('/signup', authController.signUp)
router.post('/refreshToken', auth, authController.refreshToken)

router.patch('/updateuser', auth, authController.updateUser)

module.exports = router
