const User = require('../models/User')

class ProfileController {
  async index (req, res) {
    const user = await User.findById(req.userId).select('-password')

    return res.json(user)
  }

  async update (req, res, next) {
    try {
      const user = await User.findOneAndUpdate(req.userId, req.body, {
        new: true,
        runValidators: true
      }).select('-password')

      return res.json(user)
    } catch (err) {
      return next(err)
    }
  }
}

module.exports = new ProfileController()
