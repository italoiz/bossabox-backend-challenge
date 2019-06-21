const { Router } = require('express')

const routes = new Router()

// middlewares
const authMiddleware = require('./middlewares/auth')

// Controllers
const AuthController = require('./controllers/AuthController')
const ProfileController = require('./controllers/ProfileController')

// authentication route
routes.post('/auth', AuthController.store)

/**
 * After this middleware, all routes are private.
 * Before, are public routes.
 */
routes.use(authMiddleware)

// profile route
routes.get('/me', ProfileController.index)

module.exports = routes
