const Product = require('../../models/product')
const Order = require('../../models/order')

const userPurchases = async (req, res) => {
  try {
    const _id = req.user.id

    const myOrders = await Order.find({ userId: _id })

    const populatedOrders = await Promise.all(myOrders.map(async (order) => {
      const { userId, ...cleanOrder } = order.toObject()
      const productDetails = await Product.findById(cleanOrder.productId)
      const { ownerId, ...cleanProduct } = productDetails.toObject()
      cleanOrder.productDetails = cleanProduct
      return cleanOrder
    }))

    return res.status(200).json({ myOrders: populatedOrders })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'something went wrong in server' })
  }
}

module.exports = userPurchases
