const { ObjectId } = require('mongoose').Types
const Tool = require('../models/Tool')

class ProfileController {
  /**
   * GET /tools
   */
  async index (req, res, next) {
    const { me = undefined, tag = '' } = req.query

    // default query
    let query = {
      public: true
    }

    // include private tools from logged-in user
    if (req.loggedIn && !!req.userId) {
      query = {
        $or: [
          { public: true },
          { public: false, author: ObjectId(req.userId) }
        ]
      }
    }

    // return only "me" tools
    if (req.loggedIn && !!req.userId && me !== undefined && JSON.parse(me) === true) {
      query = {
        author: { $eq: ObjectId(req.userId) }
      }
    } else if (req.loggedIn && !!req.userId && me !== undefined && JSON.parse(me) === false) {
      query = {
        author: { $ne: ObjectId(req.userId) },
        public: true
      }
    }

    // filter by tag
    if (tag) {
      query = {
        ...query,
        tags: { $in: [tag] }
      }
    }

    try {
      const tools = await Tool.find(query)
        .populate('author', '-password')

      return res.json(tools)
    } catch (err) {
      return next(err)
    }
  }

  /**
   * POST /tools
   */
  async store (req, res, next) {
    try {
      let tool = await Tool.create({
        ...req.body,
        author: req.userId
      })

      // populate
      tool = await tool.populate('author', '-password').execPopulate()

      return res.status(201).json(tool)
    } catch (err) {
      return next(err)
    }
  }

  /**
   * PUT /tools/:id
   */
  async update (req, res, next) {
    const { id } = req.params

    let tool = await Tool.findById(id)

    // not found tool
    if (!tool) {
      return res.status(404).json({
        code: 'not_found',
        error: 'Não foi possível atualizar a ferramenta. Ferramenta não encontrada'
      })
    }

    // not tool owner
    if (!tool.author.equals(req.userId)) {
      return res.status(403).json({
        code: 'permission_denied',
        error: 'Não é possível alterar uma ferramenta que não pertence a você'
      })
    }

    try {
      // update tool
      tool = await Tool.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
      })

      return res.json(tool)
    } catch (err) {
      return next(err)
    }
  }

  /**
   * DELETE /tools/:id
   */
  async destroy (req, res) {
    const { id } = req.params

    const tool = await Tool.findById(id)

    // not found tool
    if (!tool) {
      return res.status(404).json({
        code: 'not_found',
        error: 'Ferramenta não existe ou já foi excluida'
      })
    }

    // not tool owner
    if (!tool.author.equals(req.userId)) {
      return res.status(403).json({
        code: 'permission_denied',
        error: 'Você não tem permissão para excluir esta ferramenta'
      })
    }

    // delete tool
    tool.remove()

    return res.status(204).send()
  }
}

module.exports = new ProfileController()
