const mongoose = require('mongoose')
const Review = require('../../models/review')
const Product = require('../../models/product')
const Order = require('../../models/order')

const newReview = async (req, res) => {
  try {
    const { productId } = req.params
    const _id = req.user.id

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(404).send('Invalid Shop')
    }

    const existingproduct = await Product.findOne({ _id: productId })
    if (!existingproduct) {
      return res.status(406).json({ message: 'product does not exists.' })
    }

    const { description, rate } = req.body
    if (!description || !rate || rate > 5) {
      return res.status(400).json({ message: 'Fill the required fields.' })
    }

    const existingReview = await Review.findOne({ productId, userId: _id })
    if (existingReview) {
      return res.status(404).json({ message: 'you already reviewd this product.' })
    }

    const existingPurchase = await Order.findOne({ productId, userId: _id })
    if (!existingPurchase) {
      return res.status(404).json({ message: 'you cannot review this product until making a purchase.' })
    }

    const newRating = (existingproduct.rating * existingproduct.totalReviews + rate) / (existingproduct.totalReviews + 1)

    await Product.updateOne(
      { _id: productId },
      {
        $inc: { totalReviews: 1 },
        $set: { rating: newRating }
      }
    )

    const result = await Review.create({ productId, userId: _id, description, rate })

    const { userId, ...cleanReview } = result.toObject()
    return res.status(200).json({ review: cleanReview })
  } catch (error) {
    console.error('Error in newReview:', error)
    return res.status(500).json({ message: 'Something went wrong in server' })
  }
}

module.exports = newReview
