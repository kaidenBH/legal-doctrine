/* eslint-disable no-unused-vars */
const getVisaCards = require('./creditCardsIntegration')
const getUsers = require('./users')
const getProducts = require('./products')
const getOrders = require('./oreders')

const populateDatabase = async (req, res) => {
  try {
    const numberOfEntities = req.query.size
    const creditCards = await getVisaCards(numberOfEntities)
    const tokens = await getUsers(creditCards)
    const products = await getProducts(tokens)
    const orders = await getOrders(tokens, creditCards, products)
    // console.log(creditCards)
    // console.log(tokens)
    // console.log(products)
    // console.log(orders)
    return res.status(200).json({ creditCards, tokens, products, orders })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Something went wrong in server' })
  }
}

module.exports = populateDatabase
