const Product = require('../../models/product')

const newProduct = async (req, res) => {
  try {
    const _id = req.user.id

    const { name, description, category, price, inStock = 0, images = [] } = req.body
    if (!name || name.length < 4 || !description || !price || !category) {
      return res.status(400).json({ message: 'Fill the required fields.' })
    }

    const result = await Product.create({ ownerId: _id, name, description, category, price, inStock, images })

    const { ownerId, ...cleanProduct } = result.toObject()
    return res.status(200).json({ product: cleanProduct })
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong in server' })
  }
}

module.exports = newProduct
