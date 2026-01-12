require('dotenv').config()

const { NODE_ENV } = require('./config')

const isTestEnv = NODE_ENV === 'test'

const info = (...params) => {
  if (!isTestEnv) {
    console.log(...params)
  }
}

const error = (...params) => {
  if (!isTestEnv) {
    console.error(...params)
  }
}

module.exports = {
  info,
  error
}
