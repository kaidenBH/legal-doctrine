const Product = require('../../models/product')
const Order = require('../../models/order')
const purchaseTrendsService = require('../../services/purchaseTrendsService')
const moment = require('moment')

const purchaseStats = async (req, res) => {
  try {
    const totalQuantity = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: '$quantity' }
        }
      }
    ])
    const totalPurchases = totalQuantity[0].totalQuantity

    const topSellingProducts = await Product.find({ totalPurchases: { $gt: 0 } })
      .select('-ownerId')
      .sort({ totalPurchases: -1 })
      .limit(10)

    const timePeriod = moment().subtract(1, 'month')
    const purchaseTrends = await purchaseTrendsService.getPurchaseTrends(timePeriod, 10)

    return res.status(200).json({ totalPurchases, topSellingProducts, purchaseTrends })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'something went wrong in server' })
  }
}

module.exports = purchaseStats
