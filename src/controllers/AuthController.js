const { expiresIn } = require('../config/session')
const User = require('../models/User')

class AuthController {
  async store (req, res) {
    const { email, password } = req.body

    let user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        code: 'bad_request',
        error: 'Usuário ou senha inválidos'
      })
    }

    if (!(await user.comparePassword(password))) {
      return res.status(400).json({
        code: 'bad_request',
        error: 'Usuário ou senha inválidos'
      })
    }

    // get jwt
    const token = user.generateToken()

    // remove password property from user
    user = user.toJSON()
    delete user.password

    // if (process.env.NODE_ENV !== 'test') {
    //   User.create([
    //     {
    //       name: 'Italo Izaac',
    //       email: 'italoiz.dev@gmail.com',
    //       password: '1234'
    //     },
    //     {
    //       name: 'Jessica Patrícia',
    //       email: 'jessicapatricia01@gmail.com',
    //       password: '1234'
    //     }
    //   ])
    // }

    return res.json({
      user,
      token,
      expiresIn
    })
  }
}

module.exports = new AuthController()
