const router = require('express').Router()
const orderController = require('../controllers/order')
const auth = require('../middleware/auth')

router.post('/:productId', auth, orderController.purchaseProduct)
router.patch('/shipment/:orderId', auth, orderController.shipOrder)
router.get('/userPurchases', auth, orderController.userPurchases)
//  router.get('/stats', auth, orderController.purchaseStats)

module.exports = router
