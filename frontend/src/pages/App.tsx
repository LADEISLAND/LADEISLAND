import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

interface CountryState {
  state: Record<string, any>
  updated_at?: string
}

export default function AppPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [country, setCountry] = useState<CountryState | null>(null)
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [command, setCommand] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    api.get('/country/state')
      .then(res => setCountry(res.data))
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false))
  }, [navigate])

  const sendCommand = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!command.trim()) return
    const userMsg = { role: 'user' as const, content: command }
    setMessages(prev => [...prev, userMsg])
    setCommand('')
    try {
      const res = await api.post('/country/command', { command: userMsg.content })
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.assistant_message }])
      setCountry({ state: res.data.state, updated_at: new Date().toISOString() })
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error processing command' }])
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">AGI Cosmic</h1>
        <button onClick={logout} className="border px-3 py-1 rounded">Logout</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded p-4">
          <h2 className="font-semibold mb-2">Country State</h2>
          <pre className="text-sm overflow-auto max-h-[70vh] bg-gray-50 p-2 rounded">{JSON.stringify(country?.state, null, 2)}</pre>
        </div>
        <div className="border rounded p-4 flex flex-col">
          <h2 className="font-semibold mb-2">Command Console</h2>
          <div className="flex-1 overflow-auto border rounded p-2 mb-2 bg-white">
            {messages.map((m, idx) => (
              <div key={idx} className="mb-2">
                <strong>{m.role === 'user' ? 'You' : 'AI'}: </strong>
                <span>{m.content}</span>
              </div>
            ))}
          </div>
          <form onSubmit={sendCommand} className="flex gap-2">
            <input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              className="flex-1 border rounded px-3 py-2"
              placeholder="e.g., Increase education budget by 5%"
            />
            <button className="border rounded px-4">Send</button>
          </form>
        </div>
      </div>
    </div>
  )
}