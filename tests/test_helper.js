const Provider = require('../models/provider')

const providersData = [
  { name: 'provider1', licenced: true },
  { name: 'provider2', licenced: false },
  { name: 'provider3', licenced: true },
  { name: 'provider4', licenced: false },
  { name: 'provider5', licenced: true }
]

const validProviderData = { name: 'provider6', licenced: true }
const inValidProviderData = { name: 'provider7', licence: true }

const providersInDb = async () => {
  const providerData = await Provider.find({})
  return providerData.map(provider => provider.toJSON())
}

const nonExistentId = async () => {
  const providerObject = new Provider({ name: 'provider8', licenced: true })
  const savedProvider = await providerObject.save()
  await Provider.findByIdAndDelete(savedProvider._id)
  return savedProvider._id.toString()
}

module.exports = { providersData, validProviderData, inValidProviderData, providersInDb , nonExistentId}