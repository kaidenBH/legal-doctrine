const router = require('express').Router()
const productController = require('../controllers/product')
const auth = require('../middleware/auth')

router.post('/', auth, productController.newProduct)
router.post('/search', productController.searchProducts)
router.get('/:productId', productController.checkProduct)
router.patch('/:productId', auth, productController.updateProduct)
router.delete('/:productId', auth, productController.deleteProduct)

module.exports = router
