module.exports = (err, req, res, next) => {
  // handler for validation error like mongoose validation
  if (err.name === 'ValidationError') {
    let errors = []

    for (let errName in err.errors) {
      errors.push(err.errors[errName].message)
    }

    return res.status(400).json({
      code: 'bad_request',
      error: 'Oops! Erro ao tentar processar a requisição.',
      details: errors
    })
  }

  // log in development
  if (process.env.NODE_ENV === 'development') {
    /* istanbul ignore next */
    console.log(err.message)
  }

  return res.status(500).json({
    code: 'server_error',
    error: 'Desculpe!!! Estamos com algum problema, por favor, se o problema persistir entre em contato através do e-mail italoiz.dev@gmail.com'
  })
}
