const request = require('supertest')
// const jwt = require('jsonwebtoken')

const app = require('../../src/app')
const User = require('../../src/models/User')

describe('Controller | User', () => {
  it('should be able to register a new user', async () => {
    const response = await request(app)
      .post('/v1/users')
      .send({
        name: 'Foo Bar',
        email: 'foo@bar.com',
        password: '1234'
      })

    expect(response.status).toBe(201)
  })

  it('should not be able to register a new user when are logged', async () => {
    const user = await User.create({
      name: 'Foo Bar',
      email: 'foo@bar.com',
      password: '1234'
    })

    const token = await user.generateToken()

    const response = await request(app)
      .post('/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Foo Bar User',
        email: 'foo-user@bar.com',
        password: '1234'
      })

    expect(response.status).toBe(403)
  })

  it('should return a user data when successfully created', async () => {
    const response = await request(app)
      .post('/v1/users')
      .send({
        name: 'Foo Bar',
        email: 'foo@bar.com',
        password: '1234'
      })

    expect(response.body).toMatchObject({
      name: 'Foo Bar',
      email: 'foo@bar.com'
    })
  })

  it('should not contain a user password in created data', async () => {
    const response = await request(app)
      .post('/v1/users')
      .send({
        name: 'Foo Bar',
        email: 'foo@bar.com',
        password: '1234'
      })

    expect(response.body).not.toHaveProperty('password')
  })

  it('should return the user token when successfully created', async () => {
    const response = await request(app)
      .post('/v1/users')
      .send({
        name: 'Foo Bar',
        email: 'foo@bar.com',
        password: '1234'
      })

    expect(response.body).toHaveProperty('token')
  })

  it('should not be able to register a new user when there another user same e-mail', async () => {
    await User.create({
      name: 'Foo Bar',
      email: 'foo@bar.com',
      password: '1234'
    })

    const response = await request(app)
      .post('/v1/users')
      .send({
        name: 'Another Foo Bar',
        email: 'foo@bar.com',
        password: '1234'
      })

    expect(response.status).toBe(400)
  })

  it('should not be able to register with a invalid data', async () => {
    const response = await request(app)
      .post('/v1/users')
      .send({
        name: 'Foo Bar',
        email: 'invalid-email',
        password: '1234'
      })

    expect(response.status).toBe(400)
  })

  it('should not be able to register without password', async () => {
    const response = await request(app)
      .post('/v1/users')
      .send({
        name: 'Foo Bar',
        email: 'foo@bar.com'
      })

    expect(response.status).toBe(400)
  })
})
