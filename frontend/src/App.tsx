import React from 'react'
import { Link } from 'react-router-dom'

export default function Root() {
  return (
    <div className="p-6">
      <nav className="flex gap-4 mb-4">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>
      <div>Welcome to AGI Cosmic</div>
    </div>
  )
}