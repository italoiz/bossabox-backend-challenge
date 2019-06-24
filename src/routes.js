const { Router } = require('express')

const routes = new Router()

// middlewares
const privateMiddleware = require('./middlewares/private')
const loggedInMiddleware = require('./middlewares/loggedIn')

// controllers
const AuthController = require('./controllers/AuthController')
const ProfileController = require('./controllers/ProfileController')
const ToolController = require('./controllers/ToolController')
const UserController = require('./controllers/UserController')

// authentication route.
routes.post('/auth', AuthController.store)

// logged in middleware.
routes.use(loggedInMiddleware)

// register user route.
routes.post('/users', UserController.store)

// tools route.
routes.get('/tools', ToolController.index)

/**
 * After this middleware, all routes are private.
 * Before, are public routes.
 */
routes.use(privateMiddleware)

// profile route.
routes.get('/me', ProfileController.index)
routes.put('/me', ProfileController.update)

// tools route.
routes.post('/tools', ToolController.store)
routes.put('/tools/:id', ToolController.update)
routes.delete('/tools/:id', ToolController.destroy)

module.exports = routes
