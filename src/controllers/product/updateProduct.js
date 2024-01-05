const mongoose = require('mongoose')
const Product = require('../../models/product')

const updateProduct = async (req, res) => {
  try {
    const { productId: _id } = req.params

    const userId = req.user.id
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).send('Invalid product Id')
    }

    const existingproduct = await Product.findOne({ _id })
    if (!existingproduct) {
      return res.status(404).json({ message: 'product do not exists.' })
    }

    const { name, description, category, price, inStock = 0, images } = req.body

    if (userId.toString() !== existingproduct.ownerId.toString()) {
      return res.status(403).json({ message: 'Invalid request' })
    }

    const updateFields = {}

    if (name) updateFields.name = name
    if (description) updateFields.description = description
    if (category) updateFields.category = category
    if (price) updateFields.price = price
    if (inStock) updateFields.inStock = inStock
    if (images) updateFields.images = images

    const updatedproduct = await Product.findByIdAndUpdate(_id, updateFields, { new: true })

    const { ownerId, ...cleanProduct } = updatedproduct.toObject()
    return res.status(200).json({ product: cleanProduct })
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong in server' })
  }
}

module.exports = updateProduct
