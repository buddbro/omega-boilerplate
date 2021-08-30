import { useDispatch, useSelector } from 'react-redux'
import jwt_decode from 'jwt-decode'
import { useEffect, useState } from 'react'
import { setUser } from '../redux/auth'

function useAuth() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!token) return
    setIsLoading(true)
    const { sub } = jwt_decode(token)

    if (sub) {
      fetch(`/api/users/${sub}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          dispatch(setUser(data))
          setIsLoading(false)
        })
        .catch((e) => {
          console.log('Error', e)
          setIsLoading(false)
        })
    }
  }, [token, dispatch])

  const isAuthenticated = () => {
    if (user || token) return true
    let tk = localStorage.getItem('felix_cookie')
    if (tk) {
      setToken(tk)
      return true
    }
    return false
  }

  return {
    user,
    isLoading,
    isAuthenticated,
  }
}

export default useAuth
