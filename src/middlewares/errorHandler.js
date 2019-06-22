module.exports = (err, req, res, next) => {
  // handler for validation error like mongoose validation
  if (err.name === 'ValidationError') {
    let errors = []

    for (let errName in err.errors) {
      errors.push(err.errors[errName].message)
    }

    return res.status(400).json({
      code: 'bad_request',
      error: 'Alguns dados estão inválidos, por favor, corrija e tente novamente',
      details: errors
    })
  }

  return res.status(500).json({
    code: 'server_error',
    error: 'Desculpe!!! Estamos com algum problema, por favor, se o problema persistir entre em contato através do e-mail italoiz.dev@gmail.com'
  })
}