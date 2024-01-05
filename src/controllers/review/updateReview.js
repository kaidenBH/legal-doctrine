const mongoose = require('mongoose')
const Review = require('../../models/review')
const Product = require('../../models/product')

const updateReview = async (req, res) => {
  try {
    const _id = req.user.id
    const { reviewId } = req.params
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(404).send('Invalid product')
    }

    const existingReview = await Review.findOne({ _id: reviewId })
    if (!existingReview) {
      return res.status(404).json({ message: 'review does not exists.' })
    }

    const existingproduct = await Product.findOne({ _id: existingReview.productId })
    if (!existingproduct) {
      return res.status(406).json({ message: 'product does not exists.' })
    }

    const { description, rate } = req.body

    if (!description && !rate) {
      return res.status(400).json({ message: 'Fill the required fields.' })
    }

    if (_id.toString() !== existingReview.userId.toString()) {
      return res.status(403).json({ message: 'Invalid request' })
    }
    const oldRating = existingReview.rate
    const newRating = (existingproduct.rating * existingproduct.totalReviews - oldRating + rate) / (existingproduct.totalReviews)

    await Product.updateOne(
      { _id: existingproduct._id },
      {
        $set: { rating: newRating }
      }
    )

    const updateFields = {}

    if (description) updateFields.description = description
    if (rate) updateFields.rate = rate

    const updatedReview = await Review.findByIdAndUpdate(reviewId, updateFields, { new: true })
    const { userId, ...cleanReview } = updatedReview.toObject()
    return res.status(200).json({ review: cleanReview })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'something went wrong in server' })
  }
}

module.exports = updateReview
