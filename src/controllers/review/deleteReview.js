const mongoose = require('mongoose')
const Review = require('../../models/review')
const Product = require('../../models/product')

const deleteReview = async (req, res) => {
  try {
    const userId = req.user.id
    const { reviewId: _id } = req.params
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).send('Invalid product')
    }

    const existingReview = await Review.findOne({ _id })
    if (!existingReview) {
      return res.status(404).json({ message: 'review does not exists.' })
    }

    const existingproduct = await Product.findOne({ _id: existingReview.productId })
    if (!existingproduct) {
      return res.status(406).json({ message: 'product does not exists.' })
    }

    if (userId.toString() !== existingReview.userId.toString()) {
      return res.status(403).json({ message: 'Invalid request' })
    }
    const oldRating = existingReview.rate
    const newRating = (existingproduct.rating * existingproduct.totalReviews - oldRating) / (existingproduct.totalReviews)

    await Product.updateOne(
      { _id: existingproduct._id },
      {
        $inc: { totalReviews: -1 },
        $set: { rating: newRating }
      }
    )

    await Review.deleteOne({ _id })

    return res.status(200).json({ message: 'deleted review successfully' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'something went wrong in server' })
  }
}

module.exports = deleteReview
