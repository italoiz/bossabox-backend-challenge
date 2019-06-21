const request = require('supertest')
const jwt = require('jsonwebtoken')

const app = require('../../src/app')
const User = require('../../src/models/User');

describe('Controller | Profile', () => {
  it('should return user data when profile route accessed', async () => {
    const user = await User.create({
      name: 'Foo Bar',
      email: 'foo@bar.com',
      password: '1234',
    })

    // token
    const token = await user.generateToken()

    const response = await request(app)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.body).toMatchObject({
      _id: user.id,
      name: 'Foo Bar',
      email: 'foo@bar.com',
    })
  })

  it('should not return password property with user data', async () => {
    const user = await User.create({
      name: 'Foo Bar',
      email: 'foo@bar.com',
      password: '1234',
    })

    // token
    const token = await user.generateToken()

    const response = await request(app)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.body).not.toHaveProperty('password')
  })
})
