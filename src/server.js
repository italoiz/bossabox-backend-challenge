/* istanbul ignore file */
const app = require('./app')

// Server listen on port from .env file or default port 3333
app.listen(process.env.PORT || 3333)
