const jwt = require('jsonwebtoken')
const User = require('../../models/user')

const refreshToken = async (req, res) => {
  try {
    const userId = req.user.id

    const existinguser = await User.findById(userId)

    if (!existinguser) {
      return res.status(401).json({ message: 'User not found.' })
    }

    const token = jwt.sign({ email: existinguser.email, id: existinguser._id }, process.env.SECRET_TOKEN, { expiresIn: '7d' })
    const { _id, password, ...userDetails } = existinguser.toObject()
    return res.status(200).json({ userDetails, token })
  } catch (error) {
    return res.status(403).json({ message: 'Invalid refresh token.' })
  }
}

module.exports = refreshToken
