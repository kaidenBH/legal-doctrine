/* eslint-disable no-unused-vars */
const getVisaCards = require('./creditCardsIntegration')
const getUsers = require('./users')
const getProducts = require('./products')
const getOrders = require('./oreders')

const populateDatabase = async (numberOfEntities = 10) => {
  try {
    const creditCards = await getVisaCards(numberOfEntities)
    const tokens = await getUsers(creditCards)
    const products = await getProducts(tokens)
    const orders = await getOrders(tokens, creditCards, products)
    // console.log(creditCards)
    // console.log(tokens)
    // console.log(products)
    // console.log(orders)
  } catch (error) {
    console.log(error)
    throw new Error('Failed to populate database')
  }
}

module.exports = populateDatabase
