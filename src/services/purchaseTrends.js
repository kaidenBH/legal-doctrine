const Order = require('../models/order')

const getPurchaseTrends = async (timePeriod, productsLimit = 10) => {
  try {
    const trendingPurchases = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: timePeriod.toDate() }
        }
      },
      {
        $group: {
          _id: '$productId',
          totalPurchases: { $sum: '$quantity' }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          name: '$product.name',
          description: '$product.description',
          category: '$product.category',
          price: '$product.price',
          inStock: '$product.inStock',
          images: '$product.images',
          totalReviews: '$product.totalReviews',
          rating: '$product.rating',
          totalPurchases: 1
        }
      },
      {
        $sort: {
          totalPurchases: -1
        }
      },
      {
        $limit: productsLimit
      }
    ])

    return trendingPurchases
  } catch (error) {
    throw new Error('Error fetching purchase trends')
  }
}

module.exports = { getPurchaseTrends }
