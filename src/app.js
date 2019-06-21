const express = require('express')
const { connect: databaseConnect } = require('./config/database')

class App {
  constructor () {
    this.express = express()

    // connect to database.
    databaseConnect()

    this.middlewares()
    this.routes()
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
    this.express.use(require('./routes'))
  }
}

module.exports = new App().express
