const purchaseProduct = require('../controllers/order/purchaseProduct')
const { faker } = require('@faker-js/faker')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const getOrders = async (tokens, creditCards, products) => {
  try {
    const purchases = []
    for (let i = 0; i < products.length; i++) {
      const purchase = {
        quantity: faker.number.int({ min: 0, max: 50 }),
        shippingAddress: faker.location.streetAddress(),
        paymentMethod: creditCards[i].credit_card_type
      }

      let user = null
      jwt.verify(tokens[i], process.env.SECRET_TOKEN, (err, decoded) => {
        if (err) {
          console.log('Token verification failed.')
        }
        user = decoded
      })
      const res = {
        status (statusCode) {
          this.statusCode = statusCode
          return this
        },
        json (data) {
          if (this.statusCode === 200) {
            purchases.push(data.purchase)
          }
        }
      }
      await purchaseProduct({ body: purchase, user, params: { productId: products[i]._id } }, res)
    }

    console.log('\u2713 ', purchases.length, ' Purchases Were made')
    return purchases
  } catch (error) {
    console.log(error)
    throw new Error('Failed to get random orders')
  }
}

module.exports = getOrders
