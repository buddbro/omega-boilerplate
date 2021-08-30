const express = require('express')
const cors = require('cors')

const { authMiddleware } = require('./auth/utils')

const publicRoutes = {
  users: require('./routes/public/users'),
  auth: require('./routes/public/auth'),
}

const privateRoutes = {
  users: require('./routes/private/users'),
  auth: require('./routes/private/auth'),
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

app.get('/', (req, res) => {
  res.json({ message: 'You alright, mate!' })
})

for (const [routeName, routeController] of Object.entries(publicRoutes)) {
  if (routeController.getAll) {
    app.get(
      `/api/${routeName}`,
      makeHandlerAwareOfAsyncErrors(routeController.getAll)
    )
  }

  if (routeController.getById) {
    app.get(
      `/api/${routeName}/:id`,
      makeHandlerAwareOfAsyncErrors(routeController.getById)
    )
  }

  if (routeController.create) {
    app.post(
      `/api/${routeName}`,
      makeHandlerAwareOfAsyncErrors(routeController.create)
    )
  }

  if (routeController.update) {
    app.put(
      `/api/${routeName}/:id`,
      makeHandlerAwareOfAsyncErrors(routeController.update)
    )
  }

  if (routeController.remove) {
    app.delete(
      `/api/${routeName}/:id`,
      makeHandlerAwareOfAsyncErrors(routeController.remove)
    )
  }
}

for (const [routeName, routeController] of Object.entries(privateRoutes)) {
  if (routeController.getAll) {
    app.get(
      `/api/protected/${routeName}`,
      authMiddleware,
      makeHandlerAwareOfAsyncErrors(routeController.getAll)
    )
  }

  if (routeController.getById) {
    app.get(
      `/api/protected/${routeName}/:id`,
      authMiddleware,
      makeHandlerAwareOfAsyncErrors(routeController.getById)
    )
  }

  if (routeController.create) {
    app.post(
      `/api/protected/${routeName}`,
      authMiddleware,
      makeHandlerAwareOfAsyncErrors(routeController.create)
    )
  }

  if (routeController.update) {
    app.put(
      `/api/protected/${routeName}/:id`,
      authMiddleware,
      makeHandlerAwareOfAsyncErrors(routeController.update)
    )
  }

  if (routeController.remove) {
    app.delete(
      `/api/protected/${routeName}/:id`,
      authMiddleware,
      makeHandlerAwareOfAsyncErrors(routeController.remove)
    )
  }
}

module.exports = app
