import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import LoginPage from './pages/login'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/home'
import ProfilePage from './pages/profile'
import useAuth from './hooks/useAuth'

function App() {
  const { isAuthenticated } = useAuth()
  const auth = isAuthenticated()

  return (
    <Router>
      <Switch>
        <Route path="/login">
          <LoginPage auth={auth} />
        </Route>
        <ProtectedRoute component={HomePage} exact path="/" auth={auth} />
        <ProtectedRoute component={ProfilePage} path="/profile" auth={auth} />
      </Switch>
    </Router>
  )
}

export default App
