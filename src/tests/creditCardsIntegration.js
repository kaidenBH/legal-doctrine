const axios = require('axios')

const getVisaCards = async (numberOfCards = 10) => {
  try {
    let visaCards = []

    while (visaCards.length < numberOfCards) {
      const { data } = await axios.get(process.env.CREDIT_CARDS_API, { params: { size: numberOfCards } })

      if (!data) {
        throw new Error('Invalid data')
      }

      const filteredVisa = data
        .filter(card => card.credit_card_type.toLowerCase() === 'visa')
        // eslint-disable-next-line camelcase
        .map(({ credit_card_number, ...rest }) => rest)
      visaCards = visaCards.concat(filteredVisa)
    }

    console.log('\u2713 ', numberOfCards, ' Credit Cards Were Created')
    return visaCards.slice(0, numberOfCards)
  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch credit cards')
  }
}

module.exports = getVisaCards
