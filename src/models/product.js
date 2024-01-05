const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  inStock: { type: Number, required: true },
  images: { type: [String], required: false, default: () => [] },
  totalReviews: { type: Number, required: false, default: 0 },
  rating: { type: Number, required: false, default: 0 },
  totalPurchases: { type: Number, required: false, default: 0 }
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports = mongoose.model('Product', userSchema)
