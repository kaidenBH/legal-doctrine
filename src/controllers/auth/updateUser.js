const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../models/user')
const { validateEmail, validatePassword, validateUserType } = require('../../services/validation')

const updateUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: 'Invalid request' })
    }
    const userId = req.user.id

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).send('Invalid User')
    }

    const existingUser = await User.findOne({ _id: userId })
    if (!existingUser) {
      return res.status(404).json({ message: 'user do not exists.' })
    }

    const { email, oldPassword, newPassword, confirmsNewPassword, firstName, lastName, profilePicture, userType } = req.body

    if (!oldPassword) {
      return res.status(400).json({ message: 'invalid credentials.' })
    }

    const isPassowrdCorrect = await bcrypt.compare(oldPassword, existingUser.password)

    if (!isPassowrdCorrect) {
      return res.status(400).json({ message: 'Invalid credentials.' })
    }

    const updateFields = {}

    if (email) {
      if (!validateEmail(email)) {
        return res.status(400).json({ message: 'invalid new email.' })
      }
      const existEmail = await User.findOne({ email })
      const oldEmail = existingUser.email
      if (existEmail && email !== oldEmail) {
        return res.status(406).json({ message: 'Email already exists.' })
      }
      updateFields.email = email
    }

    if (newPassword) {
      if (!validatePassword(newPassword)) {
        return res.status(400).json({ message: 'invalid new Password.' })
      }
      if (!confirmsNewPassword || newPassword !== confirmsNewPassword) {
        return res.status(400).json({ message: 'Invalid credentials.' })
      }
      updateFields.password = await bcrypt.hash(newPassword, 12)
    }

    if (firstName) updateFields.firstName = firstName
    if (lastName) updateFields.lastName = lastName
    if (profilePicture) updateFields.profilePicture = profilePicture

    if (userType) {
      if (!validateUserType(userType)) {
        return res.status(400).json({ message: 'invalid User Type.' })
      }
      updateFields.userType = userType
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true })

    const { _id, verificationToken, password, ...userDetails } = updatedUser.toObject()
    const token = jwt.sign({ email: updatedUser.email, id: updatedUser._id }, process.env.SECRET_TOKEN, { expiresIn: '7d' })

    return res.status(200).json({ userDetails, token })
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong in server' })
  }
}

module.exports = updateUser
