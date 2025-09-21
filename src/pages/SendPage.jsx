import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SendPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const navigate = useNavigate()
  const code = localStorage.getItem('linked_code')

  useEffect(() => {
    if (!code) navigate('/')
  }, [code, navigate])

  async function onSubmit(e) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setStatus(null)
    try {
      const r = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), code })
      })
      const data = await r.json()
      if (r.ok && data.status === 'scheduled') {
        setStatus('Scheduled ✅')
        setQuery('')
      } else {
        setStatus(data.error || 'Send failed')
      }
    } catch (err) {
      setStatus(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    if (!code || logoutLoading) return
    setLogoutLoading(true)
    setStatus(null)
    try {
      const r = await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
      const data = await r.json().catch(() => ({}))
      if (r.ok && data.status === 'logged_out') {
        setStatus('Disconnected ✅')
        localStorage.removeItem('linked_code')
        setTimeout(() => navigate('/'), 800)
      } else {
        setStatus(data.error || 'Logout failed')
      }
    } catch (e) {
      setStatus(e.message || 'Logout error')
    } finally {
      setLogoutLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '3rem auto', textAlign: 'center' }}>
      <h1>Send Song</h1>
      <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Linked code: {code}</p>
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="Search or paste URL"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ flex: 1, padding: '0.65rem', fontSize: '1rem' }}
        />
        <button disabled={!query.trim() || loading} style={{ padding: '0.75rem 1rem' }}>
          {loading ? 'Sending…' : 'Send'}
        </button>
      </form>
      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button onClick={() => navigate('/')} style={{ padding: '0.4rem 0.75rem' }}>Link Page</button>
        <button onClick={handleLogout} disabled={logoutLoading} style={{ padding: '0.4rem 0.75rem', background: '#b30000', color: '#fff' }}>
          {logoutLoading ? 'Disconnecting…' : 'Disconnect'}
        </button>
      </div>
      {status && <p style={{ marginTop: '1rem', color: status.startsWith('Scheduled') ? 'green' : 'crimson' }}>{status}</p>}
    </div>
  )
}
