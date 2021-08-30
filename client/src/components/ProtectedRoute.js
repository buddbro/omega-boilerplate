import React from 'react'
import { Redirect } from 'react-router'
import { Route } from 'react-router-dom'

function ProtectedRoute({ component: Component, auth, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        auth ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  )
}

export default ProtectedRoute
