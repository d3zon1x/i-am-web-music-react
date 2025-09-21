export default function FloatingTelegramButton() {
  return (
    <a
      href="https://telegram.me/i_am_web_music_bot"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open Telegram bot"
      className="floating-telegram-btn fixed z-[60] bottom-4 right-4 md:bottom-6 md:right-6 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-red-700 via-rose-600 to-red-500 text-white font-medium text-sm shadow shadow-red-900/40 hover:brightness-110 active:scale-95 transition border border-white/20 backdrop-blur-md"
    >
      <svg viewBox='0 0 240 240' className='w-5 h-5' fill='currentColor' aria-hidden='true'>
        <path d='M120 0C53.7 0 0 53.7 0 120s53.7 120 120 120 120-53.7 120-120S186.3 0 120 0Zm58 83.5-17.6 83.2c-1.3 5.8-4.8 7.2-9.7 4.5l-27-19.9-13 12.5c-1.4 1.4-2.5 2.5-5.1 2.5l1.8-28.3 51.5-46.5c2.2-1.9-.5-3-3.4-1.1l-63.6 40.1-27.4-8.6c-6-1.9-6.1-6-1.3-8.9l107.2-49.2c4.9-2.2 9.2 1.1 7.6 8.9Z' />
      </svg>
      <span className='hidden sm:inline'>Telegram Bot</span>
    </a>
  )
}
