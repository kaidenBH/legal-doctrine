const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    if (!token) {
      return next()
    }

    // Verify the token
    jwt.verify(token.split(' ')[1], process.env.SECRET_TOKEN, (err, decoded) => {
      if (err) {
        console.log(token.split(' ')[1])
        return res.status(401).json({ message: 'Token verification failed.' })
      }

      req.user = decoded
      next()
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = auth
