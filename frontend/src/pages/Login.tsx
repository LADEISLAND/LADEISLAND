import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await api.post('/auth/login', { username, password })
      localStorage.setItem('token', res.data.access_token)
      navigate('/')
    } catch (err: any) {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="border rounded p-6 w-full max-w-sm space-y-3">
        <h1 className="text-xl font-semibold">Login</h1>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <input className="w-full border rounded px-3 py-2" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="w-full border rounded px-3 py-2">Sign In</button>
        <div className="text-sm">No account? <Link className="underline" to="/register">Register</Link></div>
      </form>
    </div>
  )
}