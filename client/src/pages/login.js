import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useHistory } from 'react-router-dom'
import { setUser } from '../redux/auth'
import { asyncLocalStorage } from '../utils'

function LoginPage({ auth }) {
  const history = useHistory()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (user) {
      history.push('/')
    }
  }, [user, history])

  if (auth) return <Redirect to="/" />

  const handleData = ({ token, user: us }) => {
    if (!token) {
      return
    }

    if (us) {
      dispatch(setUser(us))
    }

    asyncLocalStorage
      .setItem('felix_cookie', token)
      .then(() => asyncLocalStorage.getItem('felix_cookie'))
      .then(() => history.push('/'))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetch('http://localhost:3001/api/auth', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => handleData(data))
      .catch((e) => console.log('error', e))
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          id="username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <label>Password</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <button>Submit</button>
      </form>
    </div>
  )
}

export default LoginPage
