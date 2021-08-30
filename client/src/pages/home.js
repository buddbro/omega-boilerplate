import React from 'react'
import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div>
      <h1>Home</h1>
      <Link to="/profile">Profile</Link>
    </div>
  )
}

export default HomePage
