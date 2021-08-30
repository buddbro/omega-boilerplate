const { getIdParam } = require('../../helpers')
const { models } = require('../../../sequelize')

async function update(req, res) {
  const id = getIdParam(req)

  if (req.body.id != id) {
    res.status(400).json({
      success: false,
      msg: `ID ${id} does not match body ID ${req.body.id}`,
    })
  } else {
    const { email, password, newPassword } = req.body
    const newData = {}

    if (email) {
      const notUnique = await models.user.findOne({
        where: {
          email: email,
        },
      })

      if (notUnique) {
        res.status(400).json({
          success: false,
          msg: `Username ${username} is already taken!`,
        })
      }

      newData['email'] = email
    }

    if (password && newPassword) {
      const user = await models.user.findByPk(id)

      if (!user) {
        res.status(400).json({
          success: false,
          msg: `Could not find user matching ID ${id}`,
        })
        return
      }

      const validPassword = await user.validPassword(password, user.password)

      if (validPassword) {
        newData['password'] = newPassword
      } else {
        res.status(400).json({
          success: false,
          msg: 'Provided password did not match existing password.',
        })
        return
      }
    }

    await models.user.update(newData, {
      individualHooks: newPassword && password,
      where: {
        id: id,
      },
    })
    res.status(200).end()
  }
}

async function remove(req, res) {
  const id = getIdParam(req)
  await models.user.destroy({
    where: {
      id: id,
    },
  })
  res.status(200).end()
}

module.exports = {
  update,
  remove,
}
