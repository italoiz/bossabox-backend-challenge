const { Schema, model, Types } = require('mongoose')
const yup = require('yup')

const ToolSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Informe um nome para ferramenta']
    },
    description: { type: String },
    author: { type: Types.ObjectId, ref: 'User', required: true },
    link: {
      type: String,
      required: [true, 'É necessário informa um link para ferramenta'],
      validate: [function (value) {
        return yup.string().url().isValid(value)
      }, 'O link informado não é uma URL válida']
    },
    tags: [{ type: String, required: true }],
    public: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    collection: 'tools'
  }
)

module.exports = model('Tool', ToolSchema)
