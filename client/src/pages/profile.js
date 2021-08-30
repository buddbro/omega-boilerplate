import React from 'react'
import { Link } from 'react-router-dom'

function ProfilePage() {
  return (
    <div>
      <h1>Secret page</h1>
      <Link to="/">Home</Link>
    </div>
  )
}

export default ProfilePage
