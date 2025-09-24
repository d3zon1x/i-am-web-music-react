import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useCallback } from 'react'
import indexBg from '/src/assets/index_bg.png'
import navLogo from '/src/assets/nav_logo.png'

export default function MainPageWrapper({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const code = typeof window !== 'undefined' ? localStorage.getItem('linked_code') : null

  const handleLogout = useCallback(async () => {
    if (!code) return
    try {
      await fetch('/api/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) })
    } catch { /* ignore network errors silently */ }
    localStorage.removeItem('linked_code')
    if (location.pathname !== '/') navigate('/')
  }, [code, location.pathname, navigate])

  return (
    <div
      className='min-h-screen w-screen overflow-x-hidden relative flex flex-col bg-fixed bg-center bg-cover bg-no-repeat'
      style={{ backgroundImage: `url(${indexBg})` }}
    >
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(80,0,0,0.55),transparent_80%)]' />
      <div className='pointer-events-none absolute inset-0 bg-black/40 backdrop-blur-[2px]' />
      <header className='z-40 fixed top-0 inset-x-0 px-4 md:px-8 py-3'>
        <div className='mx-auto max-w-6xl flex items-center gap-4 md:gap-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 md:px-6 h-14 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.5)]'>
          <button onClick={() => navigate(code ? '/main' : '/')} className='flex items-center gap-3 group'>
            <img src={navLogo} alt='Logo' className='h-8 w-auto drop-shadow-md select-none' />
            <span className='text-white font-semibold tracking-wide text-sm md:text-base group-hover:text-rose-200 transition'>I AM WEB MUSIC</span>
          </button>
          <nav className='ml-auto flex items-center gap-2 text-[13px] font-medium'>
            {code && (
              <Link
                to='/send'
                className='inline-flex items-center gap-2 px-3 h-9 rounded-lg border border-white/15 text-white/85 hover:text-white hover:border-white/30 bg-white/10 hover:bg-white/15 transition shadow-sm'
              >
                <svg viewBox='0 0 24 24' className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
                  <path d='M22 2L11 13' /><path d='M22 2l-7 20-4-9-9-4 20-7z' />
                </svg>
                <span>Send</span>
              </Link>
            )}
            {code && (
              <button
                onClick={handleLogout}
                className='inline-flex items-center gap-2 px-3 h-9 rounded-lg bg-gradient-to-r from-red-800 via-rose-700 to-red-600 text-white/95 hover:text-white text-xs tracking-wide font-semibold shadow shadow-red-900/40 hover:brightness-110 active:scale-95 transition'
              >
                <svg viewBox='0 0 24 24' className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
                  <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
                  <polyline points='16 17 21 12 16 7' /><line x1='21' y1='12' x2='7' y2='12' />
                </svg>
                <span>Logout</span>
              </button>
            )}
          </nav>
        </div>
      </header>
      <main className='flex-1 w-full pt-28 pb-16 relative z-10 flex flex-col'>
        {children}
      </main>
      <footer className='relative z-10 mt-auto py-6 text-center text-[11px] text-white/40'>
        © {new Date().getFullYear()} WebMusic. Unofficial client.
      </footer>
    </div>
  )
}
