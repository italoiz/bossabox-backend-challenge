const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).json({
      code: 'unauthorized',
      error: 'Token inválido'
    })
  }

  const [, token] = authorization.split(' ')

  try {
    const tokenPayload = await jwt.verify(token, process.env.SECRET)

    // update req
    req.userId = tokenPayload.id

    return next()
  } catch (err) {
    return res.status(401).json({
      code: 'unauthorized',
      error: 'Token inválido'
    })
  }
}
