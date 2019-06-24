const User = require('../models/User')

class UserController {
  async store (req, res, next) {
    const { email } = req.body

    let user = await User.findOne({ email })

    // exists a user with same e-mail
    if (user) {
      return res.status(400).json({
        code: 'bad_request',
        error: 'Já existe um usuário com este e-mail'
      })
    }

    // not register user when are logged in
    if (req.loggedIn && !!req.userId) {
      return res.status(403).json({
        code: 'permission_denied',
        error: 'Você não pode criar um novo usuário utilizando seu usuário'
      })
    }

    try {
      // create user.
      user = await User.create(req.body)

      // get user token
      const token = await user.generateToken()

      // convert to json
      user = user.toJSON()

      // remove password property
      if (user.password) {
        delete user.password
      }

      return res.status(201).json({ ...user, token })
    } catch (err) {
      return next(err)
    }
  }
}

module.exports = new UserController()
