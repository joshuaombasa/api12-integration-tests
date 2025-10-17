const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test-helper')
const Provider = require('../models/provider')

const api = supertest(app)

beforeEach(async () => {
  await Provider.deleteMany({})

  // Use Promise.all for parallel insertions — faster and cleaner
  const providerObjects = helper.providersData.map(p => new Provider(p))
  await Promise.all(providerObjects.map(p => p.save()))
})

describe('Provider API', () => {
  describe('when there are initially some providers', () => {
    test('providers are returned as JSON', async () => {
      await api
        .get('/api/provider')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('all providers are returned', async () => {
      const response = await api
        .get('/api/provider')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body).toHaveLength(helper.providersData.length)
    })

    test('a specific provider is among those returned', async () => {
      const response = await api
        .get('/api/provider')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const names = response.body.map(p => p.name)
      expect(names).toContain(helper.providersData[0].name)
    })
  })

  describe('adding a new provider', () => {
    test('succeeds with valid data', async () => {
      await api
        .post('/api/provider')
        .send(helper.validProviderData)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const providersAfter = await helper.providersInDb()
      expect(providersAfter).toHaveLength(helper.providersData.length + 1)

      const names = providersAfter.map(p => p.name)
      expect(names).toContain(helper.validProviderData.name)
    })

    test('fails with status code 400 if data is invalid', async () => {
      await api
        .post('/api/provider')
        .send(helper.inValidProviderData)
        .expect(400)

      const providersAfter = await helper.providersInDb()
      expect(providersAfter).toHaveLength(helper.providersData.length)
    })
  })

  describe('fetching a single provider', () => {
    test('succeeds with a valid ID', async () => {
      const providersInDb = await helper.providersInDb()
      const providerToView = providersInDb[0]

      const response = await api
        .get(`/api/provider/${providerToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.name).toBe(providerToView.name)
    })

    test('fails with status code 400 for an invalid ID format', async () => {
      await api.get('/api/provider/invalid-id').expect(400)
    })

    test('fails with status code 404 for a non-existent ID', async () => {
      const nonExistentId = await helper.nonExistentId()
      await api.get(`/api/provider/${nonExistentId}`).expect(404)
    })
  })

  describe('deleting a provider', () => {
    test('succeeds with a valid ID', async () => {
      const providersAtStart = await helper.providersInDb()
      const providerToDelete = providersAtStart[0]

      await api.delete(`/api/provider/${providerToDelete.id}`).expect(204)

      const providersAtEnd = await helper.providersInDb()
      expect(providersAtEnd).toHaveLength(providersAtStart.length - 1)

      const names = providersAtEnd.map(p => p.name)
      expect(names).not.toContain(providerToDelete.name)
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
