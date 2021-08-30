const { models } = require('../../../sequelize')
const { issueJWT } = require('../../auth/utils')

async function create(req, res) {
  const { username, password } = req.body

  if (!username || !password) {
    res.status(400).send({
      success: false,
      msg: 'Missing credentials, try again!',
    })
  }

  const user = await models.user.findOne({
    where: {
      username: username,
    },
  })

  const validPassword = await user.validPassword(password, user.password)

  if (validPassword) {
    const jwt = issueJWT(user)
    res.status(201).json({
      success: true,
      user: user,
      token: jwt.token,
      expiresIn: jwt.expires,
    })
  } else {
    res.status(400).send({
      success: false,
      msg: 'Invalid password, try again!',
    })
  }
}

module.exports = {
  create,
}
