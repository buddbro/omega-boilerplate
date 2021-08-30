const { getIdParam } = require('../../helpers')
const { models } = require('../../../sequelize')
const { issueJWT } = require('../../auth/utils')

async function getAll(req, res) {
  const users = await models.user.scope('public').findAll()
  res.status(200).json(users)
}

async function getById(req, res) {
  const id = getIdParam(req)
  const user = await models.user.scope('public').findByPk(id)

  if (user) {
    res.status(200).json(user)
  } else {
    res.status(404).send('404 - Not found')
  }
}

async function create(req, res) {
  const { id, email, username, password } = req.body

  if (id) {
    res.status(400).json({
      success: false,
      msg: `ID should not be provided.`,
    })
  } else if (!email || !password || !username) {
    res.status(400).json({
      success: false,
      msg: 'Missing required parameters.',
    })
  } else {
    const usernameNotUnique = await models.user.findOne({
      where: {
        username: username,
      },
    })

    const emailNotUnique = await models.user.findOne({
      where: {
        email: email,
      },
    })

    if (usernameNotUnique) {
      res.status(400).json({
        success: false,
        msg: `Username ${username} already taken.`,
      })
    } else if (emailNotUnique) {
      res.status(400).json({
        success: false,
        msg: `Email ${email} already taken.`,
      })
    } else {
      const user = await models.user.create(req.body)
      const jwt = issueJWT(user)
      res.status(201).json({
        success: true,
        user: user,
        token: jwt.token,
        expiresIn: jwt.expires,
      })
    }
  }
}

module.exports = {
  getAll,
  getById,
  create,
}
