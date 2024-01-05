const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  return emailRegex.test(email)
}

const validatePassword = (password) => {
  // Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit.
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  return passwordRegex.test(password)
}

module.exports = {
  validateEmail,
  validatePassword
}
