// setup environment variables.
require('./env')()

const mongoose = require('mongoose')

module.exports = {
  /**
   * Connect to database.
   *
   * @returns {Promise}
   */
  connect () {
    const { DATABASE_URI } = process.env

    if (!!DATABASE_URI && mongoose.connection.readyState === 0) {
      return mongoose.connect(DATABASE_URI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false
      })
    }
  },
  /**
   * Disconnect from database.
   *
   * @param {Function} fn Callback funcion on disconnect.
   *
   * @return {Promise}
   */
  disconnect () {
    return new Promise((resolve, reject) => {
      mongoose.disconnect(resolve)
    })
  }
}
