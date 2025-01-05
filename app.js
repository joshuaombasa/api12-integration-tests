const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')

const providerRouter = require('./controllers/providers')
const userRouter = require('./controllers/users')

mongoose.connect(config.MONGO_URI)
  .then(() => logger.info('connected to mongodb'))
  .catch((error) => logger.error(error.message))


const app = express()


app.use(express.json())
app.use(cors())

app.use(middleware.requestLogger)

// app.use('/api/users', userRouter)
app.use('/api/provider', providerRouter)

app.use(middleware.unknownEndpointHandler)

app.use(middleware.errorHandler)


module.exports = app