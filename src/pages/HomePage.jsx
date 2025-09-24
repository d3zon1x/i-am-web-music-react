import { useNavigate } from 'react-router-dom'
import MainPageWrapper from '../wrappers/MainPageWrapper'

export default function HomePage() {
  const navigate = useNavigate()
  const linked = typeof window !== 'undefined' ? localStorage.getItem('linked_code') : null

  return (
    <MainPageWrapper>
      <section className='flex-1 flex items-center justify-center px-4'>
        <div className='relative w-full max-w-3xl mx-auto'>
          {/* Glow blobs */}
          <div className='pointer-events-none absolute -inset-8 rounded-[2.5rem] bg-gradient-to-br from-red-500/20 via-rose-400/10 to-transparent blur-3xl' />
          <div className='relative rounded-[2.5rem] border border-white/15 bg-white/5 backdrop-blur-xl p-10 md:p-14 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.65)] overflow-hidden'>
            <div className='pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] bg-red-800/20 rounded-full blur-3xl' />
            <div className='relative'>
              <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-rose-200 drop-shadow mb-6'>
                Stream & Send Music Seamlessly
              </h1>
              <p className='max-w-xl text-base md:text-lg text-white/70 leading-relaxed mb-10'>
                Link your session using a secure 8-digit code from our Telegram bot and start sending tracks or search queries directly. Fast, simple, elegant.
              </p>
              <div className='flex flex-col sm:flex-row gap-4'>
                <button
                  onClick={() => navigate(linked ? '/send' : '/link')}
                  className='inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-red-800 via-rose-700 to-red-600 text-white font-semibold text-sm tracking-wide shadow-lg shadow-red-900/40 hover:brightness-110 active:scale-95 transition'
                >
                  {linked ? 'Go to Send Page' : 'Get Started – Link Session'}
                </button>
                {!linked && (
                  <button
                    onClick={() => navigate('/link')}
                    className='inline-flex items-center justify-center px-8 py-4 rounded-xl border border-white/20 text-white/80 hover:text-white hover:border-white/40 bg-white/5 hover:bg-white/10 font-medium text-sm tracking-wide backdrop-blur-md transition'
                  >I already have a code</button>
                )}
              </div>
              <p className='mt-10 text-[11px] uppercase tracking-[0.25em] text-white/40 font-medium'>Unofficial Web Music Helper</p>
            </div>
          </div>
        </div>
      </section>
    </MainPageWrapper>
  )
}

