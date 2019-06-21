const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../../src/models/User');

describe('Model | User', () => {
  it('should encrypt user password correctly', async () => {
    const { password: user_password } = await User.create({
      name: 'Foo Bar',
      email: 'foo@bar.com',
      password: '1234'
    })

    const compareHash = await bcrypt.compare('1234', user_password)

    expect(compareHash).toBe(true)
  })

  it('should exists comparePassword method', async () => {
    const user = await User.create({
      name: 'Foo Bar',
      email: 'foo@bar.com',
      password: '1234'
    })

    expect(user).toHaveProperty('comparePassword')
  })

  it('should return true value when use comparePassword method with valid password', async () => {
    const user = await User.create({
      name: 'Foo Bar',
      email: 'foo@bar.com',
      password: '1234'
    })

    const validPassword = await user.comparePassword('1234')

    expect(validPassword).toBe(true)
  })

  it('should return false value when use comparePassword method with invalid password', async () => {
    const user = await User.create({
      name: 'Foo Bar',
      email: 'foo@bar.com',
      password: '1234'
    })

    const validPassword = await user.comparePassword('abc')

    expect(validPassword).toBe(false)
  })

  it('should exists generateToken method', async () => {
    const user = await User.create({
      name: 'Foo Bar',
      email: 'foo@bar.com',
      password: '1234'
    })

    expect(user).toHaveProperty('generateToken')
  })

  it('should contain `id` property when decode generated token with generateToken method', async () => {
    const user = await User.create({
      name: 'Foo Bar',
      email: 'foo@bar.com',
      password: '1234'
    })

    const userToken = await user.generateToken()
    const decodedToken = await jwt.verify(userToken, process.env.SECRET)

    expect(decodedToken).toHaveProperty('id')
  })

  it('should return a valid token when use generateToken method', async () => {
    const user = await User.create({
      name: 'Foo Bar',
      email: 'foo@bar.com',
      password: '1234'
    })

    const userToken = await user.generateToken()
    const tokenPayload = await jwt.verify(userToken, process.env.SECRET)

    expect(tokenPayload.id).toBe(user.id)
  })
})
