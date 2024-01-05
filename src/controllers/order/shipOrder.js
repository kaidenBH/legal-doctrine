const mongoose = require('mongoose')
const Product = require('../../models/product')
const Order = require('../../models/order')

const shipOrder = async (req, res) => {
  try {
    const _id = req.user.id

    const { orderId } = req.params
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(404).send('Invalid Order Id')
    }

    const exisinOrder = await Order.findOne({ _id: orderId })
    if (!exisinOrder) {
      return res.status(404).json({ message: 'order does not exist.' })
    }
    const exisinProduct = await Product.findOne({ _id: exisinOrder.productId })

    if (_id.toString() !== exisinProduct.ownerId.toString()) {
      return res.status(404).send('Invalid Request')
    }
    exisinOrder.status = 'Shipped'
    await exisinOrder.save()

    const { userId, ...updatedOrder } = exisinOrder.toObject()

    return res.status(200).json({ shipment: updatedOrder })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'something went wrong in server' })
  }
}

module.exports = shipOrder
