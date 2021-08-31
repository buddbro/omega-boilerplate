const express = require('express')
const cors = require('cors')

const { authMiddleware } = require('./auth/utils')

const publicRoutes = {
  users: require('./routes/public/users'),
  auth: require('./routes/public/auth'),
}

const privateRoutes = {
  users: require('./routes/private/users'),
}

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

function makeHandlerAwareOfAsyncErrors(handler) {
  return async function (req, res, next) {
    try {
      await handler(req, res)
    } catch (error) {
      next(error)
    }
  }
}

app.get('/api', (req, res) => {
  res.json({ message: 'You alright, mate!' })
})

for (const [routeName, routeController] of Object.entries(publicRoutes)) {
  if (routeController.getAll) {
    app.get(
      `/${routeName}`,
      makeHandlerAwareOfAsyncErrors(routeController.getAll)
    )
  }

  if (routeController.getById) {
    app.get(
      `/${routeName}/:id`,
      makeHandlerAwareOfAsyncErrors(routeController.getById)
    )
  }

  if (routeController.create) {
    app.post(
      `/${routeName}`,
      makeHandlerAwareOfAsyncErrors(routeController.create)
    )
  }

  if (routeController.update) {
    app.put(
      `/${routeName}/:id`,
      makeHandlerAwareOfAsyncErrors(routeController.update)
    )
  }

  if (routeController.remove) {
    app.delete(
      `/${routeName}/:id`,
      makeHandlerAwareOfAsyncErrors(routeController.remove)
    )
  }
}

for (const [routeName, routeController] of Object.entries(privateRoutes)) {
  if (routeController.getAll) {
    app.get(
      `/protected/${routeName}`,
      authMiddleware,
      makeHandlerAwareOfAsyncErrors(routeController.getAll)
    )
  }

  if (routeController.getById) {
    app.get(
      `/protected/${routeName}/:id`,
      authMiddleware,
      makeHandlerAwareOfAsyncErrors(routeController.getById)
    )
  }

  if (routeController.create) {
    app.post(
      `/protected/${routeName}`,
      authMiddleware,
      makeHandlerAwareOfAsyncErrors(routeController.create)
    )
  }

  if (routeController.update) {
    app.put(
      `/protected/${routeName}/:id`,
      authMiddleware,
      makeHandlerAwareOfAsyncErrors(routeController.update)
    )
  }

  if (routeController.remove) {
    app.delete(
      `/protected/${routeName}/:id`,
      authMiddleware,
      makeHandlerAwareOfAsyncErrors(routeController.remove)
    )
  }
}

module.exports = app
