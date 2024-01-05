const router = require('express').Router()
const productController = require('../controllers/product')
const reviewController = require('../controllers/review')
const auth = require('../middleware/auth')

router.post('/', auth, productController.newProduct)
router.post('/search', productController.searchProducts)
router.get('/:productId', productController.checkProduct)
router.patch('/:productId', auth, productController.updateProduct)
router.delete('/:productId', auth, productController.deleteProduct)

router.post('/newReview/:productId', auth, reviewController.newReview)
router.patch('/updateReview/:reviewId', auth, reviewController.updateReview)
router.delete('/deleteReview/:reviewId', auth, reviewController.deleteReview)

module.exports = router
