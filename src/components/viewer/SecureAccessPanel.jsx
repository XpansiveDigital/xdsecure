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

        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-white/8 border border-white/12 flex items-center justify-center backdrop-blur-sm">
            <svg className="w-6 h-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
            </svg>
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
              className={`w-full rounded-xl border px-4 py-3 text-sm placeholder-white/25 focus:outline-none focus:ring-2 transition pr-10 bg-white/8 text-white ${
                error
                  ? 'border-red-400/50 focus:ring-red-400/50'
                  : 'border-white/12 focus:ring-white/20 focus:border-white/25'
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
