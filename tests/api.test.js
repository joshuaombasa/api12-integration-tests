const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test-helper')
const Provider = require('../models/provider')

const api = supertest(app)

beforeEach(async () => {
  await Provider.deleteMany({})
  for (let provider of helper.providersData) {
    const providerObject = new Provider(provider)
    await providerObject.save()
  }
})

describe('when there is initially some providers', () => {
  test('providers are returned as JSON', async () => {
    await api.get('/api/provider')
      .send()
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all providers are returned', async () => {
    const response = await api.get('/api/provider')
      .send()
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(helper.providersData.length)
  })

  test('a certain provider is among those returned', async () => {
    const response = await api.get('/api/provider')
      .send()
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const names = response.body.map(p => p.name)
    expect(names).toContain(helper.providersData[0].name)
  })
})

describe('addition of a new provider', () => {
  test('succeeds when given valid data', async () => {
    const response = await api.post('/api/provider')
      .send(helper.validProviderData)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test('fails with statuscode 400 when given invalid data', async () => {
    const response = await api.post('/api/provider')
      .send(helper.inValidProviderData)
      .expect(400)
  })
})

describe('fetching a single provider', () => {
  test('succeeds when given a valid Id', async () => {
    const providersInDb = await helper.providersInDb()
    const response = await api.get(`/api/provider/${providersInDb[0].id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('fails with statuscode 400 when given an invalid Id', async () => {
    const providersInDb = await helper.providersInDb()
    const response = await api.get(`/api/provider/kqkdj`)
      .expect(400)
  })

  test('fails with statuscode 404 when given a nonExistent Id', async () => {
    const nonExistentId = await helper.nonExistentId()
    const response = await api.get(`/api/provider/${nonExistentId}`)
      .expect(404)
  })
})


describe('deleting a provider', () => {
  test('succeeds when given a valid id', async() => {
    const providersInDb = await helper.providersInDb()
    const response = await api.delete(`/api/provider/${providersInDb[0].id}`)
      .expect(204)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})