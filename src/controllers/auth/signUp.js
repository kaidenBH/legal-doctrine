const jwt = require('jsonwebtoken')
const User = require('../../models/user')
const bcrypt = require('bcryptjs')
const { validateEmail, validatePassword } = require('../../services/validation')

const signUp = async (req, res) => {
  try {
    const { email, password: pass, confirmPassword, firstName, lastName } = req.body

    if (!email || !pass || !firstName || !lastName) {
      return res.status(400).json({ message: 'Fill the required fields.' })
    }

    if (!validateEmail(email) || !validatePassword(pass)) {
      return res.status(400).json({ message: 'invalid credentials.' })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(406).json({ message: 'User already exists.' })
    }

    if (pass !== confirmPassword) {
      return res.status(401).json({ message: 'Passowrds Incorerct. ' })
    }

    const hashPassowrd = await bcrypt.hash(pass, 12)

    const result = await User.create({ firstName, lastName, email, password: hashPassowrd })

    const token = jwt.sign({ email: result.email, id: result._id }, process.env.SECRET_TOKEN, { expiresIn: '7d' })
    const { _id, password, ...userDetails } = result.toObject()
    return res.status(200).json({ userDetails, token })
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong in server' })
  }
}

module.exports = signUp
