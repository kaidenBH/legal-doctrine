const signUp = require('../controllers/auth/signUp')
const { faker } = require('@faker-js/faker')

const getUsers = async (creditCards) => {
  try {
    const tokens = []
    for (let i = 0; i < creditCards.length; i++) {
      const randomPassword = faker.internet.password()
      const user = {
        email: faker.internet.email(),
        password: randomPassword,
        confirmPassword: randomPassword,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName()
      }

      const res = {
        status (statusCode) {
          this.statusCode = statusCode
          return this
        },
        json (data) {
          if (this.statusCode === 200) {
            tokens.push(data.token)
          }
        }
      }
      await signUp({ body: user }, res)
    }

    console.log('\u2713 ', tokens.length, ' Users Were Created')
    return tokens
  } catch (error) {
    console.log(error)
    throw new Error('Failed to get random users')
  }
}

module.exports = getUsers
