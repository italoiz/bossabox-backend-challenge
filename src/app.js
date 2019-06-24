const express = require('express')
const { connect: databaseConnect } = require('./config/database')

class App {
  constructor () {
    this.express = express()

    // connect to database.
    databaseConnect()

    this.middlewares()
    this.routes()
    this.errorHandlers()
  }

  /**
   * Application middlewares.
   *
   * @returns void
   */
  middlewares () {
    this.express.use(express.json())
  }

  /**
   * Application routes.
   *
   * @return void
   */
  routes () {
    this.express.use('/v1', require('./routes'))
  }

  /**
   * Error Handlers.
   *
   * @return void
   */
  errorHandlers () {
    this.express.use(require('./middlewares/errorHandler'))
  }
}

module.exports = new App().express
