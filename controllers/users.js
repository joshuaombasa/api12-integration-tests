const express = require('express')
const User = require('../models/user')

const userRouter = express.Router()

// Get all users
userRouter.get('/', async (req, res, next) => {
  try {
    const users = await User.find({})
    res.status(200).json(users)
  } catch (error) {
    next(error)
  }
})

// Get single user by ID
userRouter.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
})

// Create a new user
userRouter.post('/', async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = new User({ email, password })
    const savedUser = await user.save()
    res.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

// Update user by ID
userRouter.put('/:id', async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email && !password) {
      return res.status(400).json({ message: 'At least one field required to update' })
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { email, password },
      { new: true, runValidators: true }
    )

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json(updatedUser)
  } catch (error) {
    next(error)
  }
})

// Delete user by ID
userRouter.delete('/:id', async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id)

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})

module.exports = userRouter
