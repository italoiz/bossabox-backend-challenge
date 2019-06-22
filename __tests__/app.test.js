const errorHandler = require('../src/middlewares/errorHandler')

describe('App', () => {
  it('should return error code 500 when something was not well in general', async () => {
    const req = { params: {}, body: {} }

    const res = {
      data: null,
      code: null,
      status (status) {
        this.code = status
        return this
      },
      send (payload) {
        this.data = payload
      },
      json (payload) {
        this.send(payload)
      }
    }

    errorHandler(new Error(), req, res, jest.fn())

    expect(res.code).toBe(500)
  })
})
