const mongoose = require('mongoose')
const Product = require('../../models/product')

const checkProduct = async (req, res) => {
  try {
    const { productId: _id } = req.params
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).send('Invalid Product Id')
    }

    const existingProduct = await Product.findOne({ _id })
    if (!existingProduct) {
      return res.status(406).json({ message: 'product does not exists.' })
    }
    const { ownerId, ...cleanProduct } = existingProduct.toObject()
    return res.status(200).json({ product: cleanProduct })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Something went wrong in server' })
  }
}

module.exports = checkProduct
