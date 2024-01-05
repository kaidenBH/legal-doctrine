const mongoose = require('mongoose')
const Product = require('../../models/product')

const deleteProduct = async (req, res) => {
  try {
    const { productId: _id } = req.params
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).send('Invalid Product Id')
    }
    const userId = req.user.id

    const existingproduct = await Product.findOne({ _id })
    if (!existingproduct) {
      return res.status(404).json({ message: 'product do not exists.' })
    }

    if (userId.toString() !== existingproduct.ownerId.toString()) {
      return res.status(403).json({ message: 'Invalid request' })
    }

    await Product.deleteOne({ _id })

    return res.status(200).json({ message: 'deleted product successfully' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'something went wrong in server' })
  }
}

module.exports = deleteProduct
