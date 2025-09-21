import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LinkPage() {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('linked_code')
    if (stored) {
      navigate('/send')
    }
  }, [navigate])

  const valid = /^\d{8}$/.test(code)

  async function onSubmit(e) {
    e.preventDefault()
    if (!valid) return
    setLoading(true)
    setStatus(null)
    try {
      const r = await fetch('/api/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
      const data = await r.json()
      if (r.ok && data.status === 'linked') {
        localStorage.setItem('linked_code', data.code)
        setStatus('Linked! Redirecting...')
        setTimeout(() => navigate('/send'), 600)
      } else {
        setStatus(data.error || 'Link failed')
      }
    } catch (err) {
      setStatus(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 380, margin: '4rem auto', textAlign: 'center' }}>
      <h1>Link Session</h1>
      <p>Enter the 8-digit code the Telegram bot shows you.</p>
      <form noValidate onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          inputMode="numeric"
          maxLength={8}
          placeholder="12345678"
          value={code}
          onChange={e => {
            const sanitized = e.target.value.replace(/[^0-9]/g, '').slice(0, 8)
            setCode(sanitized)
          }}
          style={{ fontSize: '1.5rem', letterSpacing: '0.2rem', textAlign: 'center', padding: '0.5rem' }}
        />
        {!valid && code.length > 0 && (
          <span style={{ color: 'crimson', fontSize: '0.85rem' }}>Code must be exactly 8 digits.</span>
        )}
        <button disabled={!valid || loading} style={{ padding: '0.75rem', fontSize: '1rem' }}>
          {loading ? 'Linking...' : 'Link'}
        </button>
      </form>
      {status && <p style={{ color: status.startsWith('Linked') ? 'green' : 'crimson' }}>{status}</p>}
    </div>
  )
}
