
const User = require('../models/User')

class ProfileController {
  async index (req, res) {
    const user = await User.findById(req.userId).select('-password')

    return res.json(user)
  }

  async update (req, res, next) {
    let user = await User.findById(req.userId)

    // not found
    if (!user) {
      return res.status(404).json({
        code: 'not_found',
        error: 'Desculpe!!! Não nada para atualizar aqui, por favor, tente realizar o login novamente'
      })
    }

    try {
      // update data
      user.set(req.body)

      // validate data
      await user.validate()

      // save data
      await user.save()

      // convert to json and remove password property
      user = user.toJSON()
      delete user.password

      return res.json(user)
    } catch (err) {
      return next(err)
    }
  }
}

module.exports = new ProfileController()
