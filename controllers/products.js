const express = require('express')
const Provider = require('../models/provider')

const providerRouter = express.Router()

// GET all providers
providerRouter.get('/', async (req, res, next) => {
  try {
    const providers = await Provider.find({})
    res.status(200).json(providers)
  } catch (error) {
    next(error)
  }
})

// GET provider by ID
providerRouter.get('/:id', async (req, res, next) => {
  try {
    const provider = await Provider.findById(req.params.id)
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' })
    }
    res.status(200).json(provider)
  } catch (error) {
    next(error)
  }
})

// CREATE new provider
providerRouter.post('/', async (req, res, next) => {
  try {
    const { name, licenced } = req.body
    if (!name) {
      return res.status(400).json({ message: 'Name is required' })
    }

    const newProvider = new Provider({ name, licenced })
    const savedProvider = await newProvider.save()
    res.status(201).json(savedProvider)
  } catch (error) {
    next(error)
  }
})

// UPDATE provider by ID
providerRouter.put('/:id', async (req, res, next) => {
  try {
    const { name, licenced } = req.body
    const updatedProvider = await Provider.findByIdAndUpdate(
      req.params.id,
      { name, licenced },
      { new: true, runValidators: true }
    )

    if (!updatedProvider) {
      return res.status(404).json({ message: 'Provider not found' })
    }

    res.status(200).json(updatedProvider)
  } catch (error) {
    next(error)
  }
})

// DELETE provider by ID
providerRouter.delete('/:id', async (req, res, next) => {
  try {
    const deletedProvider = await Provider.findByIdAndDelete(req.params.id)
    if (!deletedProvider) {
      return res.status(404).json({ message: 'Provider not found' })
    }
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})

module.exports = providerRouter
