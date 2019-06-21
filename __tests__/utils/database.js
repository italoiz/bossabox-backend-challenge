const mongoose = require('mongoose')
const { connect, disconnect } = require('../../src/config/database')

// before all suite test
beforeAll(async () => {
  await connect()
})

// after all suite test
afterAll(async () => {
  await disconnect()
})

// after each test
beforeEach(async () => {
  await mongoose.connection.dropDatabase()
})
