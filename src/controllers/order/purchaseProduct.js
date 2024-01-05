const mongoose = require('mongoose')
const Product = require('../../models/product')
const Order = require('../../models/order')

const purchaseProduct = async (req, res) => {
  try {
    const _id = req.user.id
    const { productId } = req.params
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(404).send('Invalid Product Id')
    }

    const existingproduct = await Product.findOne({ _id: productId })
    if (!existingproduct) {
      return res.status(406).json({ message: 'product does not exists.' })
    }

    const { quantity = 1, shippingAddress, paymentMethod } = req.body
    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: 'Fill the required fields.' })
    }
    if (quantity > existingproduct.inStock) {
      return res.status(400).json({ message: 'the quantity is more than the stock.' })
    }
    const totalPrice = existingproduct.price * quantity

    await Product.updateOne(
      { _id: productId },
      {
        $inc: {
          totalPurchases: quantity,
          inStock: -quantity
        }
      }
    )

    const result = await Order.create({ userId: _id, productId, quantity, totalPrice, shippingAddress, paymentMethod })
    const { userId, ...cleanPurchase } = result.toObject()
    return res.status(200).json({ purchase: cleanPurchase })
  } catch (error) {
    console.error('Error in newReview:', error)
    return res.status(500).json({ message: 'Something went wrong in server' })
  }
}

module.exports = purchaseProduct
