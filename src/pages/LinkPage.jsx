import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthPageWrapper from '../wrappers/LinkPageWrapper.jsx'

export default function LinkPage() {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('linked_code')
    if (stored) navigate('/send')
  }, [navigate])

  useEffect(() => {
    if (!showHelp) return
    function onKey(e) { if (e.key === 'Escape') setShowHelp(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showHelp])

  const valid = /^\d{8}$/.test(code)

  async function onSubmit(e) {
    e.preventDefault()
    if (!valid) return
    setLoading(true)
    setStatus(null)
    try {
      const r = await fetch('/api/link', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) })
      const data = await r.json()
      if (r.ok && data.status === 'linked') {
        localStorage.setItem('linked_code', data.code)
        setStatus('Linked! Redirecting...')
        setTimeout(() => navigate('/send'), 600)
      } else setStatus(data.error || 'Link failed')
    } catch (err) { setStatus(err.message) } finally { setLoading(false) }
  }

  return (
    <AuthPageWrapper>
      <form
        noValidate
        onSubmit={onSubmit}
        className="relative w-full max-w-md group"
      >
        {/* Decorative background glows */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-white/15 via-white/5 to-white/10 blur-lg opacity-60 group-hover:opacity-90 transition" />
        <div className="relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl px-8 pt-10 pb-8 overflow-hidden">
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-60 h-60 bg-pink-500/20 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 -right-12 w-64 h-64 bg-red-700/30 rounded-full blur-3xl" />

          <h1 className="relative text-center text-3xl font-bold tracking-tight text-white drop-shadow mb-3">Link Session</h1>
          <p className="relative text-center text-sm text-white/70 mb-4">Enter the 8‑digit code from the bot to connect.</p>

          <div className="relative mb-6 flex justify-center">
            <button
              type="button"
              onClick={() => setShowHelp(true)}
              className="text-[11px] font-medium tracking-wide text-rose-200/80 hover:text-rose-100 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/15 shadow-sm transition"
            >
              Where to get code?
            </button>
          </div>

          <label htmlFor="code" className="relative block text-[11px] font-semibold tracking-widest text-white/60 uppercase mb-3">Session Code</label>
          <div className="relative mb-4">
            <input
              id="code"
              type="text"
              inputMode="numeric"
              maxLength={8}
              placeholder="12345678"
              value={code}
              onChange={e => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 8))}
              className="peer w-full text-center font-mono text-2xl tracking-[0.55em] caret-red-400 py-5 rounded-xl border border-white/25 bg-white/5 hover:bg-white/10 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-red-400/40 text-white placeholder-white/30 transition"
            />
            <div className="absolute inset-y-0 left-0 right-0 pointer-events-none rounded-xl ring-1 ring-white/10 peer-focus:ring-red-400/40" />
          </div>
          <div className="flex justify-between text-[11px] font-medium mb-6">
            <span className="text-white/40">{code.length}/8</span>
            {!valid && code.length > 0 && <span className="text-amber-300">Need exactly 8 digits</span>}
            {valid && <span className="text-emerald-400">Ready</span>}
          </div>

            <button
              type="submit"
              disabled={!valid || loading}
              className="relative w-full py-4 rounded-xl font-semibold text-sm uppercase tracking-wide bg-gradient-to-r from-red-800 via-[#87291f] to-red-600 text-white shadow-lg shadow-red-900/30 hover:brightness-110 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Linking…' : 'Link Session'}
            </button>

          {status && (
            <p className={`mt-6 text-center text-sm font-medium ${status.startsWith('Linked') ? 'text-emerald-400' : 'text-red-300'}`}>{status}</p>
          )}
        </div>
      </form>

      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowHelp(false)} />
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-sm rounded-2xl border border-white/15 bg-gradient-to-br from-[#290d0d]/90 via-[#3a1311]/85 to-[#511c17]/85 backdrop-blur-xl shadow-2xl p-6 animate-fade-in"
          >
            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="absolute top-3 right-3 text-white/60 hover:text-white/90 text-sm"
              aria-label="Close help"
            >✕</button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-900/40">
                {/* Telegram icon (inline SVG) */}
                <svg viewBox="0 0 240 240" className="w-6 h-6 text-white" fill="currentColor" aria-hidden="true">
                  <path d="M120 0C53.7 0 0 53.7 0 120s53.7 120 120 120 120-53.7 120-120S186.3 0 120 0Zm58 83.5-17.6 83.2c-1.3 5.8-4.8 7.2-9.7 4.5l-27-19.9-13 12.5c-1.4 1.4-2.5 2.5-5.1 2.5l1.8-28.3 51.5-46.5c2.2-1.9-.5-3-3.4-1.1l-63.6 40.1-27.4-8.6c-6-1.9-6.1-6-1.3-8.9l107.2-49.2c4.9-2.2 9.2 1.1 7.6 8.9Z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white tracking-tight">Get Your Code</h2>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-[13px] text-white/80 mb-4">
              <li>Open the Telegram bot below.</li>
              <li>Send <code className="font-mono bg-white/10 px-1 py-0.5 rounded text-[11px]">/account</code>.</li>
              <li>Copy the 8-digit code you receive.</li>
              <li>Paste it into the field on the form.</li>
            </ol>
            <a
              href="https://telegram.me/i_am_web_music_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-red-700 via-rose-600 to-red-500 text-white font-medium text-sm shadow shadow-red-900/40 hover:brightness-110 active:scale-[0.99] transition"
            >
              <svg viewBox="0 0 240 240" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                <path d="M120 0C53.7 0 0 53.7 0 120s53.7 120 120 120 120-53.7 120-120S186.3 0 120 0Zm58 83.5-17.6 83.2c-1.3 5.8-4.8 7.2-9.7 4.5l-27-19.9-13 12.5c-1.4 1.4-2.5 2.5-5.1 2.5l1.8-28.3 51.5-46.5c2.2-1.9-.5-3-3.4-1.1l-63.6 40.1-27.4-8.6c-6-1.9-6.1-6-1.3-8.9l107.2-49.2c4.9-2.2 9.2 1.1 7.6 8.9Z" />
              </svg>
              Open Telegram Bot
            </a>
            <p className="mt-4 text-center text-[11px] text-white/40">Press Esc or outside to close.</p>
          </div>
        </div>
      )}
    </AuthPageWrapper>
  )
}
