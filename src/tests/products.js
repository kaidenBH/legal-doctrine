const newProduct = require('../controllers/product/newProduct')
const { faker } = require('@faker-js/faker')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const getProducts = async (tokens) => {
  try {
    const products = []
    for (let i = 0; i < tokens.length; i++) {
      const product = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.product(),
        price: faker.commerce.price(),
        inStock: faker.number.int({ min: 50, max: 100 })
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
            products.push(data.product)
          }
        }
      }
      await newProduct({ body: product, user }, res)
    }

    console.log('\u2713 ', products.length, ' Products Were made')
    return products
  } catch (error) {
    console.log(error)
    throw new Error('Failed to get random products')
  }
}

module.exports = getProducts
