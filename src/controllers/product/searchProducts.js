const Product = require('../../models/product')

const searchProducts = async (req, res) => {
  try {
    const { pageNumber = 1, itemsPerPage = 20, productName = '', category = '', minPrice, maxPrice, inStock = false } = req.body

    const skipPages = (pageNumber - 1) * itemsPerPage

    const productQuery = {}

    if (productName !== '') {
      const regexProductName = new RegExp(productName, 'i')
      productQuery.name = { $regex: regexProductName }
    }

    if (category !== '') {
      productQuery.category = category
    }

    if (minPrice !== undefined) {
      productQuery.price = { $gte: minPrice }
    }

    if (maxPrice !== undefined) {
      if (productQuery.price) {
        productQuery.price.$lte = maxPrice
      } else {
        productQuery.price = { $lte: maxPrice }
      }
    }

    if (inStock === true) {
      productQuery.inStock = { $gte: 1 }
    }

    const totalproducts = await Product.countDocuments(productQuery)
    const allproducts = await Product.find(productQuery)
      .select('-ownerId')
      .skip(skipPages)
      .limit(itemsPerPage)

    return res.status(200).json({
      currentPage: pageNumber,
      totalPages: Math.ceil(totalproducts / itemsPerPage),
      products: allproducts
    })
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong in server' })
  }
}

module.exports = searchProducts
