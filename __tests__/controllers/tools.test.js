const request = require('supertest')

const app = require('../../src/app')
const User = require('../../src/models/User')
const Tool = require('../../src/models/Tool')

const { getRandomItem } = require('../utils/helpers')

describe('Controller | Tools', () => {
  let tools, author

  beforeEach(async () => {
    // default author
    author = await User.create({
      name: 'Foo Bar',
      email: 'foo@bar.com',
      password: '1234'
    })

    // defaults tools
    tools = [
      {
        name: 'React',
        author: author.id,
        link: 'https://reactjs.org/',
        tags: ['javascript', 'facebook', 'framework'],
        public: true
      },
      {
        name: 'Angular2+',
        author: author.id,
        link: 'https://angular.io/',
        tags: ['javascript', 'google', 'framework'],
        public: true
      },
      {
        name: 'Vue',
        author: author.id,
        link: 'https://vuejs.org/',
        tags: ['javascript', 'framework'],
        public: false
      },
      {
        name: 'Jest',
        author: author.id,
        link: 'https://jestjs.is/',
        tags: ['javascript', 'facebook', 'framework'],
        public: false
      }
    ]
  })

  it('should return an array on tools route', async () => {
    await Tool.create(tools)

    const response = await request(app)
      .get('/v1/tools')

    expect(response.body).toBeArray()
  })

  it('should return an array of public tools when accessed without token', async () => {
    await Tool.create(tools)

    const response = await request(app)
      .get('/v1/tools')

    expect(response.body).toBeArrayOfSize(2)
  })

  it('should return an array of private tool when accessed with token', async () => {
    await Tool.create(tools)

    const token = await author.generateToken()

    const response = await request(app)
      .get('/v1/tools')
      .set('Authorization', `Bearer ${token}`)

    expect(response.body).toBeArrayOfSize(4)
  })

  it('should return private tools only from the logged-in user', async () => {
    const anotherAuthor = await User.create({
      name: 'Another Foo Bar',
      email: 'anoter-foo@bar.com',
      password: '1234'
    })

    await Tool.create([
      ...tools,
      {
        name: 'Another tool',
        author: anotherAuthor.id,
        link: 'https://another-tool.com/',
        tags: ['tag'],
        public: false
      }
    ])

    const token = await author.generateToken()

    const response = await request(app)
      .get('/v1/tools')
      .set('Authorization', `Bearer ${token}`)

    expect(response.body).toBeArrayOfSize(4)
  })

  it('should returns owner tools when `me` property exists on query string and equals true', async () => {
    const anotherAuthor = await User.create({
      name: 'Another Foo Bar',
      email: 'anoter-foo@bar.com',
      password: '1234'
    })

    await Tool.create([
      ...tools,
      {
        name: 'Another tool',
        author: anotherAuthor.id,
        link: 'https://another-tool.com/',
        tags: ['tag']
      }
    ])

    const token = await author.generateToken()

    const response = await request(app)
      .get('/v1/tools')
      .query({ me: true })
      .set('Authorization', `Bearer ${token}`)

    expect(response.body).toBeArrayOfSize(4)
  })

  it('should not returns my tools when `me` property exist on query string and equals false', async () => {
    const anotherAuthor = await User.create({
      name: 'Another Foo Bar',
      email: 'anoter-foo@bar.com',
      password: '1234'
    })

    await Tool.create([
      ...tools,
      {
        name: 'Another tool',
        author: anotherAuthor.id,
        link: 'https://another-tool.com/',
        tags: ['tag']
      }
    ])

    const token = await anotherAuthor.generateToken()

    const response = await request(app)
      .get('/v1/tools')
      .query({ me: false })
      .set('Authorization', `Bearer ${token}`)

    expect(response.body).toBeArrayOfSize(2)
  })

  it('should returns tools correctly when filter by tag', async () => {
    await Tool.create(tools)

    const response = await request(app)
      .get('/v1/tools')
      .query({ tag: 'facebook' })

    expect(response.body).toBeArrayOfSize(1)
  })

  it('should be able add new tool', async () => {
    const tool = getRandomItem(tools)
    const token = await author.generateToken()

    const response = await request(app)
      .post('/v1/tools')
      .set('Authorization', `Bearer ${token}`)
      .send(tool)

    expect(response.status).toBe(201)
  })

  it('should return a new tool into response body when add new tool', async () => {
    const tool = getRandomItem(tools)
    const token = await author.generateToken()

    const response = await request(app)
      .post('/v1/tools')
      .set('Authorization', `Bearer ${token}`)
      .send(tool)

    expect(response.body).toMatchObject({
      ...tool,
      author: {
        _id: author.id,
        name: author.name,
        email: author.email
      }
    })
  })

  it('should return an error when send data is invalid', async () => {
    const tool = getRandomItem(tools)
    const token = await author.generateToken()

    const response = await request(app)
      .post('/v1/tools')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: tool.name
      })

    expect(response.status).toBe(400)
  })

  it('should be able update a tool', async () => {
    const randomTool = getRandomItem(tools)
    const tool = await Tool.create(randomTool)

    const token = await author.generateToken()

    await request(app)
      .put(`/v1/tools/${tool._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'foo bar tool'
      })

    const updatedTool = await Tool.findById(tool._id)

    expect(updatedTool.name).toBe('foo bar tool')
  })

  it('should return updated tool when update a tool', async () => {
    const randomTool = getRandomItem(tools)
    const tool = await Tool.create(randomTool)

    const token = await author.generateToken()

    const response = await request(app)
      .put(`/v1/tools/${tool._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'foo bar tool'
      })

    expect(response.body).toMatchObject({
      _id: tool.id,
      name: 'foo bar tool'
    })
  })

  it('should receive an `not_found` error when try to update a tool that not exists', async () => {
    const token = await author.generateToken()

    const response = await request(app)
      .put('/v1/tools/5d0c3553bf1d3886da65805c')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'foo bar tool'
      })

    expect(response.status).toBe(404)
  })

  it('should receive an `permission_denied` error when try to update a tool that not own', async () => {
    const anotherAuthor = await User.create({
      name: 'Another Foo Bar',
      email: 'another-foo@bar.com',
      password: '1234'
    })

    const token = await anotherAuthor.generateToken()
    const tool = await Tool.create(getRandomItem(tools))

    const response = await request(app)
      .put(`/v1/tools/${tool._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'foo bar tool'
      })

    expect(response.status).toBe(403)
  })

  it('should not be able to update a tool when data is invalid', async () => {
    const tool = await Tool.create(getRandomItem(tools))

    const token = await author.generateToken()

    const response = await request(app)
      .put(`/v1/tools/${tool._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: ''
      })

    expect(response.status).toBe(400)
  })

  it('should be able delete a tool', async () => {
    const randomTool = getRandomItem(tools)
    const tool = await Tool.create(randomTool)

    const token = await author.generateToken()

    const response = await request(app)
      .delete(`/v1/tools/${tool._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toBe(204)
  })

  it('should receive an `not_found` error when try to delete a tool that not exists', async () => {
    const token = await author.generateToken()

    const response = await request(app)
      .delete('/v1/tools/5d0c3553bf1d3886da65805c')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toBe(404)
  })

  it('should receive an `permission_denied` error when try to delete a tool that not own', async () => {
    const anotherAuthor = await User.create({
      name: 'Another Foo Bar',
      email: 'another-foo@bar.com',
      password: '1234'
    })

    const token = await anotherAuthor.generateToken()
    const tool = await Tool.create(getRandomItem(tools))

    const response = await request(app)
      .delete(`/v1/tools/${tool._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toBe(403)
  })

  it('should not be able find a deleted tool', async () => {
    const randomTool = getRandomItem(tools)
    const tool = await Tool.create(randomTool)

    const token = await author.generateToken()

    await request(app)
      .delete(`/v1/tools/${tool._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    const deletedTool = await Tool.findById(tool._id)

    expect(deletedTool).not.toBeTruthy()
  })
})
