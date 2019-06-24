const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Schema, model } = require('mongoose')
const yup = require('yup')

const { expiresIn } = require('../config/session')

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'É necessário informar um nome']
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [function (value) {
        return yup.string().email().isValid(value)
      }, 'O e-mail informado não válido']
    },
    password: { type: String, required: [true, 'Digite uma senha válida'] }
  },
  {
    timestamps: true,
    collection: 'users'
  }
)

// encrypt password before save
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8)
  }

  return next()
})

UserSchema.methods = {
  /**
   * Compare password is correctly.
   *
   * @param {String} password The password to compare.
   *
   * @returns {Boolean}
   */
  comparePassword (password) {
    return bcrypt.compare(password, this.password)
  },
  /**
   * Generate JWT.
   *
   * @returns {String}
   */
  generateToken () {
    return jwt.sign({ id: this.id }, process.env.SECRET, {
      expiresIn
    })
  }
}

module.exports = model('User', UserSchema)
