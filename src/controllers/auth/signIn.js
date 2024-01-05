const jwt = require('jsonwebtoken')
const User = require('../../models/user')
const bcrypt = require('bcryptjs')

const signIn = async (req, res) => {
  try {
    const { email, password: pass } = req.body

    if (!email || !pass) {
      return res.status(400).json({ message: 'Fill the required fields.' })
    }
    const existingUser = await User.findOne({ email })

    if (!existingUser) {
      return res.status(404).json({ message: 'User does not exists.' })
    }

    const isPassowrdCorrect = await bcrypt.compare(pass, existingUser.password)

    if (!isPassowrdCorrect) {
      return res.status(401).json({ message: 'Password Incorerct.' })
    }

    const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.SECRET_TOKEN, { expiresIn: '7d' })
    const { _id, password, ...userDetails } = existingUser.toObject()

    return res.status(200).json({ userDetails, token })
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong in server' })
  }
}

module.exports = signIn
