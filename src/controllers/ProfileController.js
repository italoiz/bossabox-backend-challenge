const User = require('../models/User')

class ProfileController {
  async index (req, res) {
    const user = await User.findById(req.userId).select('-password')

    return res.json(user)
  }
}

module.exports = new ProfileController()
