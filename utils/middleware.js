const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:', request.path)
  logger.info('Body:', request.body)
  logger.info('___')
  next()
}

const unknownEndpointHandler = (request, response, next) => {
  return response.status(404).send({ error: [{ message: 'unknown endpoint' }] })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: [{ message: error.message }] })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: [{ message: error.message }] })
  }

  response.status(400).send({ error: [{ message: 'something went wrong' }] })
}

module.exports = { unknownEndpointHandler, errorHandler, requestLogger }