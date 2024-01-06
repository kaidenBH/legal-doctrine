const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
  status: { type: String, required: true, default: 'pending' },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  shippingAddress: { type: String, required: true },
  paymentMethod: { type: String, required: true }
},
{
  timestamps: {
    order_date: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports = mongoose.model('Order', userSchema)
