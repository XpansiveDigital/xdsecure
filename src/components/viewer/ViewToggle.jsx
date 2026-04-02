// ViewToggle: Sales View / Secure View tab switcher.
// Adapts to dark header when Secure View is unlocked.

export default function ViewToggle({ activeView, onViewChange, isUnlocked }) {
  const dark = activeView === 'secure' && isUnlocked

  return (
    <div className={`flex items-center gap-0.5 rounded-xl p-1 transition-colors duration-300 ${
      dark ? 'bg-slate-800' : 'bg-zinc-100'
    }`}>

      {/* Sales View */}
      <button
        onClick={() => onViewChange('sales')}
        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
          activeView === 'sales'
            ? 'bg-white text-slate-900 shadow-sm'
            : dark
              ? 'text-white/60 hover:text-white hover:bg-slate-700'
              : 'text-zinc-500 hover:text-slate-700 hover:bg-zinc-50'
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        Sales View
      </button>

      {/* Secure View */}
      <button
        onClick={() => onViewChange('secure')}
        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
          activeView === 'secure'
            ? dark
              ? 'bg-slate-600 text-white shadow-sm'
              : 'bg-white text-slate-900 shadow-sm'
            : dark
              ? 'text-white/60 hover:text-white hover:bg-slate-700'
              : 'text-zinc-500 hover:text-slate-700 hover:bg-zinc-50'
        }`}
      >
        {isUnlocked && activeView === 'secure' ? (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        )}
        Secure View
      </button>

    </div>
  )
}
