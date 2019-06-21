/* istanbul ignore file */
const dotenv = require('dotenv')
const path = require('path')
const fs = require('fs')

module.exports = () => {
  // environment
  const env = process.env.NODE_ENV
  let envFile = '.env'

  if (env) {
    envFile = `${envFile}.${env}`
  }

  // get environment file absolute path.
  const filePath = path.resolve(__dirname, '..', '..', envFile)

  // check if exists .env.NODE_ENV file and read file.
  if (fs.existsSync(filePath)) {
    return dotenv.config({
      path: filePath
    })
  }

  // check if .env default file exists.
  const defaultEnvPath = path.resolve(__dirname, '..', '..', '.env')

  if (!fs.existsSync(defaultEnvPath)) return

  // if not exists .env.NODE_ENV, get default .env file.
  return dotenv.config({
    path: defaultEnvPath
  })
}
