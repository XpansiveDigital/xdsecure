// AssetNavigation: left-hand sidebar showing assets grouped by category.
// Filters based on the current view mode and unlock state.

// Small "Vetted" badge for vetted-only assets
function VettedBadge({ active }) {
  return (
    <span className={`ml-auto shrink-0 text-[10px] font-semibold tracking-wide rounded px-1.5 py-0.5 ${
      active
        ? 'bg-white/20 text-white'
        : 'bg-amber-50 text-amber-600 border border-amber-200'
    }`}>
      Vetted
    </span>
  )
}

const TYPE_ICONS = {
  embed: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  ),
  pdf: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  image: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  video: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
    </svg>
  ),
}

export default function AssetNavigation({ assets, activeView, isUnlocked, selectedId, onSelect }) {
  // Filter assets based on view mode
  const visibleAssets = assets.filter((a) => {
    if (activeView === 'sales') return a.visibility === 'both' || a.visibility === 'sales'
    // Enhanced view: show everything if unlocked, otherwise only public assets
    if (activeView === 'secure' && isUnlocked) return true
    return a.visibility === 'both' || a.visibility === 'sales'
  })

  // Vetted assets use visibility === 'vetted' (previously 'secure' in the data layer)

  // Group by category, preserving asset order
  const grouped = {}
  visibleAssets.forEach((asset) => {
    const cat = asset.category || 'Other'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(asset)
  })

  const isEnhancedMode = activeView === 'secure' && isUnlocked

  if (visibleAssets.length === 0) {
    return (
      <div className="p-5 text-xs text-zinc-400 text-center leading-relaxed">
        No assets available in this view.
      </div>
    )
  }

  return (
    <nav className="py-3">

      {/* Enhanced access enabled indicator */}
      {isEnhancedMode && (
        <div className="mx-3 mb-3 px-3 py-2.5 rounded-xl bg-slate-900 flex items-center gap-2.5">
          <svg className="w-3.5 h-3.5 text-white/60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <span className="text-xs font-semibold text-white/80">Enhanced access enabled</span>
        </div>
      )}

      {Object.entries(grouped).map(([category, catAssets]) => (
        <div key={category} className="mb-4">
          <div className="px-4 mb-1">
            <span className={`text-[10px] font-semibold uppercase tracking-widest ${
              isEnhancedMode ? 'text-white/30' : 'text-zinc-400'
            }`}>
              {category}
            </span>
          </div>
          <ul>
            {catAssets.map((asset) => {
              const isActive = selectedId === asset.id
              const isVetted = asset.visibility === 'vetted' || asset.visibility === 'secure'
              return (
                <li key={asset.id}>
                  <button
                    onClick={() => onSelect(asset.id)}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors group ${
                      isActive
                        ? isEnhancedMode
                          ? 'bg-slate-700 text-white'
                          : 'bg-slate-900 text-white'
                        : isEnhancedMode
                          ? 'text-white/60 hover:bg-slate-800 hover:text-white'
                          : 'text-slate-600 hover:bg-zinc-100 hover:text-slate-800'
                    }`}
                  >
                    <span className={`shrink-0 transition-colors ${
                      isActive ? 'text-white/50' : isEnhancedMode ? 'text-white/30 group-hover:text-white/50' : 'text-zinc-300 group-hover:text-zinc-400'
                    }`}>
                      {TYPE_ICONS[asset.type] || TYPE_ICONS.embed}
                    </span>
                    <span className="flex-1 text-sm font-medium truncate">{asset.name}</span>
                    {/* Show Vetted badge on vetted-only assets in enhanced view */}
                    {isVetted && isEnhancedMode && (
                      <VettedBadge active={isActive} />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
