import { useState } from 'react'

// SecureAccessPanel: gated access moment before Enhanced View is unlocked.
// Presents the access code prompt with appropriate positioning language.
// TODO: Replace local check with API call (e.g. POST /api/guides/:id/authenticate)
//       that returns a short-lived session token stored in state.

export default function SecureAccessPanel({ correctPassword, onUnlock }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [showCode, setShowCode] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    // TODO: Replace direct string comparison with backend auth when available.
    if (input === correctPassword) {
      setError(false)
      onUnlock()
    } else {
      setError(true)
      setInput('')
    }
  }

  return (
    // Full-area gate screen — dark gradient background signals elevated context
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">

      {/* Subtle dot-grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative w-full max-w-sm">

        {/* Lock icon — large and prominent */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Soft glow behind the icon */}
            <div className="absolute inset-0 rounded-full bg-white/5 blur-2xl scale-150" />
            <div className="relative w-24 h-24 rounded-3xl bg-white/6 border border-white/10 flex items-center justify-center">
              <svg className="w-12 h-12 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-center text-xl font-semibold text-white mb-2 tracking-tight">
          Additional Detail Available
        </h2>
        <p className="text-center text-sm text-white/45 mb-8 leading-relaxed">
          Access more detailed layouts and information, typically shared with qualified clients and partners.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              type={showCode ? 'text' : 'password'}
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(false) }}
              placeholder="Access code"
              className={`w-full rounded-xl border px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition pr-10 bg-slate-800 ${
                error
                  ? 'border-red-500/60 focus:ring-red-500/40'
                  : 'border-slate-700 focus:ring-white/20 focus:border-slate-500'
              }`}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowCode((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition"
            >
              {showCode ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-400/80 text-center">
              That code doesn't match. Please check and try again.
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-white text-slate-900 text-sm font-semibold hover:bg-white/90 transition shadow-lg shadow-black/30"
          >
            Enter Access Code
          </button>
        </form>

        {/* Footer note */}
        <p className="text-center text-xs text-white/25 mt-6">
          Don't have an access code? Contact your venue representative.
        </p>

      </div>
    </div>
  )
}
