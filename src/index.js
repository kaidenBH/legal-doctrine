const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const route = require('./routes/routes')
const dotenv = require('dotenv')
// eslint-disable-next-line no-unused-vars
const populateDatabase = require('./tests/populateDatabase')

const app = express()
dotenv.config()

populateDatabase(100)

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())

app.use('/', route)

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.DB_URI

mongoose.connect(MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`ERROR ${error} did not connect`))
