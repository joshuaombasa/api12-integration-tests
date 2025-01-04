const express = require('express')
const User = require('../models/user')

const userRouter = express.Router()

userRouter.get('/', async (request, response, next) => {
  const users = await User.find({})
  try {
    response.send(users)
  } catch (error) {
    next(error)
  }
})

userRouter.get('/:id', async (request, response, next) => {
  const user = await User.findById(request.params.id)
  try {
    response.send(user)
  } catch (error) {
    next(error)
  }
})

userRouter.post('/:id', async (request, response, next) => {
  const { email, password } = request.body
  const userObject = new User({ email, password })
  try {
    const savedUser = await userObject.save()
    response.status(201).send(savedUser)
  } catch (error) {
    next(error)
  }
})

userRouter.put('/:id', async (request, response, next) => {
  const { email, password } = request.body

  try {
    const updatedUser = await User.findByIdAndUpdate(
      request.params.id,
      { email, password },
      { new: true }
    )
    response.send(updatedUser)
  } catch (error) {
    next(error)
  }
})

userRouter.delete('/:id', async (request, response, next) => {

  try {
    await User.findByIdAndDelete(request.params.id)
    response.sendStatus(204)
  } catch (error) {
    next(error)
  }
})



module.exports = { userRouter }