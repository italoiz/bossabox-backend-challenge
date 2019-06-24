const request = require('supertest')
const jwt = require('jsonwebtoken')

const app = require('../../src/app')
const User = require('../../src/models/User')

describe('Controller | Auth', () => {
  it('should be able to sign in with a valid credentials', async () => {
    const { email } = await User.create({
      name: 'Foo Bar',
      email: 'foo@bar.com',
      password: '1234'
    })

    const response = await request(app)
      .post('/v1/auth')
      .send({
        email,
        password: '1234'
      })

    expect(response.status).toBe(200)
  })

  it('should not be able sign in with a invalid user', async () => {
    const response = await request(app)
      .post('/v1/auth')
      .send({
        email: 'foo@bar.com',
        password: '1234'
      })

    expect(response.status).toBe(400)
  })

  it('should not be able sign in with a invalid password', async () => {
    const { email } = await User.create({
      name: 'Foo Bar',
      email: 'foo@bar.com',
      password: '1234'
    })

    const response = await request(app)
      .post('/v1/auth')
      .send({
        email,
        password: '12345'
      })

    expect(response.status).toBe(400)
  })

  it('should return jwt token when authenticated successfully', async () => {
    const { email } = await User.create({
      name: 'Foo Bar',
      email: 'foo@bar.com',
      password: '1234'
    })

    const response = await request(app)
      .post('/v1/auth')
      .send({
        email,
        password: '1234'
      })

    expect(response.body).toHaveProperty('token')
  })

  it('should be able to access private routes when authenticated', async () => {
    const user = await User.create({
      name: 'Foo Bar',
      email: 'foo@bar.com',
      password: '1234'
    })

    // token
    const token = await user.generateToken()

    const response = await request(app)
      .get('/v1/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
  })

  it('should not be able to access private routes when not authenticated', async () => {
    const response = await request(app)
      .get('/v1/me')

    expect(response.status).toBe(401)
  })

  it('should not be able to access private routes with a invalid token', async () => {
    const response = await request(app)
      .get('/v1/me')
      .set('Authorization', `Bearer 1234`)

    expect(response.status).toBe(401)
  })

  it('should not return password property when authenticated successfully', async () => {
    const { email } = await User.create({
      name: 'Foo Bar',
      email: 'foo@bar.com',
      password: '1234'
    })

    const response = await request(app)
      .post('/v1/auth')
      .send({
        email,
        password: '1234'
      })

    expect(response.body).not.toHaveProperty('user.password')
  })

  it('should return expires property when authenticated sucessfully', async () => {
    const { email } = await User.create({
      name: 'Foo Bar',
      email: 'foo@bar.com',
      password: '1234'
    })

    const response = await request(app)
      .post('/v1/auth')
      .send({
        email,
        password: '1234'
      })

    expect(response.body).toHaveProperty('expiresIn')
  })

  it('should not be able to access private routes with a expired token', async () => {
    const user = await User.create({
      name: 'Foo Bar',
      email: 'foo@bar.com',
      password: '1234'
    })

    // expired token
    const token = await jwt.sign({ id: user.id }, process.env.SECRET, {
      expiresIn: '-10s'
    })

    const response = await request(app)
      .get('/v1/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(401)
  })
})
