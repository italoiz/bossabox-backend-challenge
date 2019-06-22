module.exports = async (req, res, next) => {
  // user already logged in
  if (req.loggedIn && !!req.userId) {
    return next()
  }

  return res.status(401).json({
    code: 'unauthorized',
    error: 'Você precisa estar logado para fazer isto'
  })
}
