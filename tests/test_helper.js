const Provider = require('../models/provider')

const providersData = [
  { name: 'Provider 1', licenced: true },
  { name: 'Provider 2', licenced: false },
  { name: 'Provider 3', licenced: true },
  { name: 'Provider 4', licenced: false },
  { name: 'Provider 5', licenced: true },
]

const validProviderData = { name: 'Provider 6', licenced: true }
const invalidProviderData = { name: 'Provider 7', licence: true } // Typo intentional for test

/**
 * Fetch all providers currently stored in the database.
 * @returns {Promise<Array>} - List of providers as plain JSON objects.
 */
const getProvidersInDb = async () => {
  const providers = await Provider.find({})
  return providers.map(provider => provider.toJSON())
}

/**
 * Generate a valid but non-existent provider ID.
 * Useful for testing endpoints that handle unknown IDs.
 * @returns {Promise<string>} - A valid MongoDB ObjectId string that no longer exists in the DB.
 */
const getNonExistentId = async () => {
  const provider = new Provider({ name: 'Temporary Provider', licenced: true })
  const savedProvider = await provider.save()
  await Provider.findByIdAndDelete(savedProvider._id)
  return savedProvider._id.toString()
}

module.exports = {
  providersData,
  validProviderData,
  invalidProviderData,
  getProvidersInDb,
  getNonExistentId,
}
