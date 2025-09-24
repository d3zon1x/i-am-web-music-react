import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MainPageWrapper from '../wrappers/MainPageWrapper.js'

export default function SendPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const navigate = useNavigate()
  const code = typeof window !== 'undefined' ? localStorage.getItem('linked_code') : null

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
        setTimeout(() => navigate('/'), 600)
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
    <MainPageWrapper>
      <div className='flex flex-1 items-center justify-center px-4 md:px-8'>
        <div className='relative w-full max-w-2xl group'>
          <div className='absolute -inset-1 rounded-3xl bg-gradient-to-br from-white/15 via-white/5 to-white/10 blur-lg opacity-60 group-hover:opacity-90 transition' />
          <div className='relative rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl px-8 py-10 overflow-hidden'>
            <div className='pointer-events-none absolute -top-20 -left-10 w-72 h-72 bg-red-700/30 rounded-full blur-3xl' />
            <div className='pointer-events-none absolute -bottom-24 -right-20 w-[30rem] h-[30rem] bg-rose-600/30 rounded-full blur-3xl' />

            <header className='relative mb-8'>
              <h1 className='text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow'>Send Music</h1>
              <p className='mt-2 text-sm text-white/60'>Linked code: <span className='font-mono text-white/80'>{code || '—'}</span></p>
            </header>

            <form onSubmit={onSubmit} className='relative flex flex-col gap-5'>
              <div className='relative'>
                <label htmlFor='query' className='block text-[11px] font-semibold tracking-widest text-white/50 uppercase mb-2'>Search / URL</label>
                <div className='relative'>
                  <input
                    id='query'
                    type='text'
                    placeholder='Type a song name or paste a link...'
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className='w-full rounded-xl border border-white/25 bg-white/5 hover:bg-white/10 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-500/40 px-5 py-4 text-white placeholder-white/30 text-sm transition'
                  />
                  <div className='absolute inset-y-0 right-3 flex items-center gap-2'>
                    {query && (
                      <button type='button' onClick={() => setQuery('')} className='text-white/40 hover:text-white/80 text-xs font-medium px-2 py-1 rounded-lg hover:bg-white/10 transition'>Clear</button>
                    )}
                  </div>
                </div>
                <p className='mt-2 text-[11px] text-white/40'>Supports keywords or direct URLs (YouTube, etc).</p>
              </div>

              <div className='flex flex-col sm:flex-row gap-3'>
                <button
                  type='submit'
                  disabled={!query.trim() || loading}
                  className='flex-1 inline-flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm uppercase tracking-wide bg-gradient-to-r from-red-800 via-rose-700 to-red-600 text-white shadow-lg shadow-red-900/30 hover:brightness-110 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition'
                >
                  {loading ? 'Sending…' : 'Send'}
                </button>
                <button
                  type='button'
                  onClick={handleLogout}
                  disabled={logoutLoading || !code}
                  className='sm:w-40 inline-flex items-center justify-center py-4 rounded-xl font-semibold text-sm uppercase tracking-wide border border-white/20 text-white/70 hover:text-white hover:border-white/40 bg-white/5 hover:bg-white/10 active:scale-[0.99] disabled:opacity-40 transition backdrop-blur-md'
                >
                  {logoutLoading ? '...' : 'Disconnect'}
                </button>
              </div>
            </form>

            {status && (
              <p className={`mt-8 text-center text-sm font-medium ${status.startsWith('Scheduled') || status.startsWith('Disconnected') ? 'text-emerald-400' : 'text-red-300'}`}>{status}</p>
            )}
          </div>
        </div>
      </div>
    </MainPageWrapper>
  )
}
