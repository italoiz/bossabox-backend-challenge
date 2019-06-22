const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
  const { authorization } = req.headers

  // defaults values
  req.loggedIn = false
  req.userId = null

  if (!authorization) {
    return next()
  }

  const [, token] = authorization.split(' ')

  try {
    const tokenPayload = await jwt.verify(token, process.env.SECRET)

    // set values
    req.loggedIn = true
    req.userId = tokenPayload.id

    return next()
  } catch (err) {
    return res.status(401).json({
      code: 'unauthorized',
      error: 'Token inválido'
    })
  }
}
