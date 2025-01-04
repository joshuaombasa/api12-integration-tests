const express = require('express')
const Provider = require('../models/provider')

const providerRouter = express.Router()

providerRouter.get('/', async (request, response, next) => {
  const providers = await Provider.find({})
  try {
    response.send(providers)
  } catch (error) {
    next(error)
  }
})

providerRouter.get('/:id', async (request, response, next) => {
  try {
    const provider = await Provider.findById(request.params.id)
    if (!provider) {
      return response.status(404).end()
    }
    response.send(provider)
  } catch (error) {
    next(error)
  }
})

providerRouter.post('/', async (request, response, next) => {
  const { name, licenced } = request.body
  try {
    const providerObject = new Provider({ name, licenced })
    const savedProvider = await providerObject.save()
    response.status(201).send(savedProvider)
  } catch (error) {
    next(error)
  }
})


providerRouter.put('/', async (request, response, next) => {
  const { name, licenced } = request.body
  try {
    const updatedProvider = await Provider.findByIdAndUpdate(
      request.params.id,
      { name, licenced },
      { new: true }
    )
    response.send(updatedProvider)
  } catch (error) {
    next(error)
  }
})

providerRouter.delete('/:id', async (request,response,next) => {
 
  try {
    await Provider.findByIdAndDelete(request.params.id)
    response.sendStatus(204)
  } catch (error) {
    next(error)
  }
})

module.exports = providerRouter