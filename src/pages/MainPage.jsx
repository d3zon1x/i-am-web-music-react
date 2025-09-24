import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainPageWrapper from '../wrappers/MainPageWrapper'

export default function MainPage() {
  const navigate = useNavigate()
  const code = typeof window !== 'undefined' ? localStorage.getItem('linked_code') : null
  const [period, setPeriod] = useState('week')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [items, setItems] = useState([])
  const [sendingId, setSendingId] = useState(null)

  useEffect(() => {
    if (!code) navigate('/')
  }, [code, navigate])

  useEffect(() => {
    let ignore = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const r = await fetch(`/api/charts?period=${encodeURIComponent(period)}&limit=20`)
        const data = await r.json()
        if (!ignore) {
          if (r.ok && Array.isArray(data.items)) setItems(data.items)
          else setError(data.error || 'Failed to load charts')
        }
      } catch (e) {
        if (!ignore) setError(e.message || 'Failed to load charts')
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => { ignore = true }
  }, [period])

  const top3 = useMemo(() => items.slice(0, 3), [items])
  const rest = useMemo(() => items.slice(3), [items])

  async function sendTrack(item) {
    if (sendingId) return
    const query = item.youtube_url || `${item.artist || ''} ${item.title || ''}`.trim()
    if (!query) return
    setSendingId(item.id || query)
    try {
      const r = await fetch('/api/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, code }) })
      const data = await r.json().catch(() => ({}))
      if (!r.ok || data.status !== 'scheduled') {
        alert(data.error || 'Failed to schedule download')
      }
    } catch (e) {
      alert(e.message || 'Network error')
    } finally {
      setSendingId(null)
    }
  }

  return (
    <MainPageWrapper>
      <section className='px-4 md:px-8'>
        <div className='mx-auto max-w-6xl'>
          {/* CTA */}
          <div className='relative mb-8 md:mb-10'>
            <div className='absolute -inset-1 rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-white/10 blur-lg opacity-60' />
            <div className='relative rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6'>
              <div className='flex-1'>
                <h1 className='text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow'>Welcome back</h1>
                <p className='mt-1 text-white/70 text-sm'>You can search or paste a link and send it to Telegram instantly.</p>
              </div>
              <button
                onClick={() => navigate('/send')}
                className='inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-800 via-rose-700 to-red-600 text-white font-semibold text-sm tracking-wide shadow-lg shadow-red-900/40 hover:brightness-110 active:scale-95 transition'
              >
                <svg viewBox='0 0 24 24' className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
                  <path d='M22 2L11 13' /><path d='M22 2l-7 20-4-9-9-4 20-7z' />
                </svg>
                <span>Search to download</span>
              </button>
            </div>
          </div>

          {/* Charts header */}
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg md:text-xl font-bold text-white'>Top downloads</h2>
            <div className='flex items-center gap-2 text-[12px]'>
              <PeriodButton value='week' period={period} setPeriod={setPeriod} />
              <PeriodButton value='month' period={period} setPeriod={setPeriod} />
              <PeriodButton value='year' period={period} setPeriod={setPeriod} />
              <PeriodButton value='all' period={period} setPeriod={setPeriod} />
            </div>
          </div>

          {/* Loading / Error */}
          {loading && (
            <div className='text-white/60 text-sm'>Loading charts…</div>
          )}
          {error && !loading && (
            <div className='text-red-300 text-sm'>{error}</div>
          )}

          {!loading && !error && (
            <div className='space-y-8'>
              {/* Top 3 cards with rank badges */}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {top3.map((it, idx) => {
                  const rank = idx + 1
                  const rankClass = rank === 1 ? 'from-yellow-400 to-amber-600' : rank === 2 ? 'from-gray-300 to-slate-400' : 'from-orange-400 to-red-500'
                  return (
                    <div key={it.id || idx} className='relative group rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl overflow-hidden shadow-lg'>
                      {it.thumbnail_url && (
                        <div className='aspect-video w-full overflow-hidden relative'>
                          <img src={it.thumbnail_url} alt={it.title || 'thumbnail'} className='w-full h-full object-cover group-hover:scale-105 transition' />
                          {/* Rank badge */}
                          <div className={`absolute top-3 left-3 inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br ${rankClass} text-black font-extrabold shadow-lg shadow-black/30`}>#{rank}</div>
                        </div>
                      )}
                      <div className='p-4 flex flex-col gap-2'>
                        <div className='flex items-start justify-between gap-3'>
                          <div className='min-w-0'>
                            <p className='text-white/70 text-xs'>{it.downloads} downloads</p>
                            <h3 className='text-white font-semibold leading-snug truncate'>{it.title || 'Unknown title'}</h3>
                            {it.artist && <p className='text-white/70 text-sm truncate'>{it.artist}</p>}
                          </div>
                        </div>
                        <div className='mt-1 flex items-center gap-2'>
                          {it.youtube_url && (
                            <a href={it.youtube_url} target='_blank' rel='noopener noreferrer' className='inline-flex items-center gap-2 px-3 h-9 rounded-lg border border-white/20 text-white/85 hover:text-white hover:border-white/40 bg-white/5 hover:bg-white/10 text-xs transition'>
                              <svg viewBox='0 0 24 24' className='w-4 h-4' aria-hidden='true' fill='currentColor'>
                                <path d='M23.5 6.2a4.6 4.6 0 0 0-3.2-3.2C18.5 2.5 12 2.5 12 2.5s-6.5 0-8.3.5A4.6 4.6 0 0 0 .5 6.2 48.4 48.4 0 0 0 0 12a48.4 48.4 0 0 0 .5 5.8 4.6 4.6 0 0 0 3.2 3.2c1.8.5 8.3.5 8.3.5s6.5 0 8.3-.5a4.6 4.6 0 0 0 3.2-3.2c.5-1.8.5-5.8.5-5.8s0-4-.5-5.8zM9.7 15.5V8.5L15.8 12l-6.1 3.5z'/>
                              </svg>
                              <span>YouTube</span>
                            </a>
                          )}
                          <button
                            onClick={() => sendTrack(it)}
                            disabled={!!sendingId}
                            className='inline-flex items-center gap-2 px-3 h-9 rounded-lg bg-gradient-to-r from-red-800 via-rose-700 to-red-600 text-white/95 hover:text-white text-xs font-semibold shadow shadow-red-900/40 hover:brightness-110 active:scale-95 disabled:opacity-40 transition'
                          >
                            <svg viewBox='0 0 24 24' className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
                              <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
                              <polyline points='7 10 12 15 17 10' />
                              <line x1='12' y1='15' x2='12' y2='3' />
                            </svg>
                            <span>{sendingId ? 'Scheduling…' : 'Download'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Rest list with rank chips */}
              {rest.length > 0 && (
                <div className='rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl divide-y divide-white/10'>
                  {rest.map((it, idx) => {
                    const rank = idx + 4
                    return (
                      <div key={it.id || `r-${idx}`} className='p-3 sm:p-4 flex items-center gap-3'>
                        <div className='w-8 shrink-0'>
                          <div className='w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/80 text-xs font-bold'>#{rank}</div>
                        </div>
                        {it.thumbnail_url && (
                          <img src={it.thumbnail_url} alt='' className='w-12 h-12 rounded-md object-cover hidden sm:block' />
                        )}
                        <div className='flex-1 min-w-0'>
                          <div className='truncate text-white font-medium'>{it.title || 'Unknown'}</div>
                          <div className='flex items-center gap-2'>
                            {it.artist && <div className='truncate text-white/70 text-sm'>{it.artist}</div>}
                            <span className='text-white/50 text-[11px]'>• {it.downloads} downloads</span>
                          </div>
                        </div>
                        <div className='flex items-center gap-2'>
                          {it.youtube_url && (
                            <a href={it.youtube_url} target='_blank' rel='noopener noreferrer' className='inline-flex items-center gap-1.5 px-3 h-9 rounded-lg border border-white/20 text-white/85 hover:text-white hover:border-white/40 bg-white/5 hover:bg-white/10 text-xs transition'>
                              <svg viewBox='0 0 24 24' className='w-4 h-4' aria-hidden='true' fill='currentColor'>
                                <path d='M23.5 6.2a4.6 4.6 0 0 0-3.2-3.2C18.5 2.5 12 2.5 12 2.5s-6.5 0-8.3.5A4.6 4.6 0 0 0 .5 6.2 48.4 48.4 0 0 0 0 12a48.4 48.4 0 0 0 .5 5.8 4.6 4.6 0 0 0 3.2 3.2c1.8.5 8.3.5 8.3.5s6.5 0 8.3-.5a4.6 4.6 0 0 0 3.2-3.2c.5-1.8.5-5.8.5-5.8s0-4-.5-5.8zM9.7 15.5V8.5L15.8 12l-6.1 3.5z'/>
                              </svg>
                              <span>YouTube</span>
                            </a>
                          )}
                          <button
                            onClick={() => sendTrack(it)}
                            disabled={!!sendingId}
                            className='inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-gradient-to-r from-red-800 via-rose-700 to-red-600 text-white/95 hover:text-white text-xs font-semibold shadow shadow-red-900/40 hover:brightness-110 active:scale-95 disabled:opacity-40 transition'
                          >
                            <svg viewBox='0 0 24 24' className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
                              <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
                              <polyline points='7 10 12 15 17 10' />
                              <line x1='12' y1='15' x2='12' y2='3' />
                            </svg>
                            <span>{sendingId ? '...' : 'Download'}</span>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {items.length === 0 && (
                <p className='text-white/60 text-sm'>No data yet.</p>
              )}
            </div>
          )}
        </div>
      </section>
    </MainPageWrapper>
  )
}

function PeriodButton({ value, period, setPeriod }) {
  const active = period === value
  return (
    <button
      onClick={() => setPeriod(value)}
      className={`px-3 h-8 rounded-lg text-xs font-medium border transition ${active ? 'bg-white/15 text-white border-white/20' : 'text-white/70 hover:text-white border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10'}`}
    >{value}</button>
  )
}
