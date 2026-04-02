import { useState, useEffect } from 'react'
import ViewToggle from './ViewToggle'
import SecureAccessPanel from './SecureAccessPanel'
import AssetNavigation from './AssetNavigation'
import AssetRenderer from './AssetRenderer'

// ViewerPanel: the published guide face — the thing clients and venue staff see.
// State:
//   activeView   — 'sales' | 'secure'
//   isUnlocked   — whether the correct access code has been entered
//   selectedId   — currently selected asset ID

export default function ViewerPanel({ guide }) {
  const [activeView, setActiveView] = useState('sales')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  // Auto-select the first visible asset when view or unlock state changes
  useEffect(() => {
    const visible = guide.assets.filter((a) => {
      if (activeView === 'sales') return a.visibility === 'both' || a.visibility === 'sales'
      // Enhanced view: show everything when unlocked (vetted + public)
      if (activeView === 'secure' && isUnlocked) return true
      return a.visibility === 'both' || a.visibility === 'sales'
    })
    if (visible.length > 0 && !visible.find((a) => a.id === selectedId)) {
      setSelectedId(visible[0].id)
    }
  }, [activeView, isUnlocked, guide.assets])

  const selectedAsset = guide.assets.find((a) => a.id === selectedId)
  const showAccessGate = activeView === 'secure' && !isUnlocked
  const isEnhancedMode = activeView === 'secure' && isUnlocked

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">

      {/* Viewer header */}
      <div className={`border-b px-6 shrink-0 transition-colors duration-300 ${
        isEnhancedMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-zinc-200'
      }`}>
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-6 h-16">

          {/* Venue + guide identity */}
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <h1 className={`text-base font-semibold truncate tracking-tight ${
                isEnhancedMode ? 'text-white' : 'text-slate-900'
              }`}>
                {guide.venueName}
              </h1>
              <span className={isEnhancedMode ? 'text-white/20' : 'text-zinc-300'}>·</span>
              <span className={`text-sm truncate ${
                isEnhancedMode ? 'text-white/50' : 'text-zinc-500'
              }`}>
                {guide.guideName}
              </span>
            </div>
            <p className={`text-xs mt-0.5 truncate max-w-lg leading-relaxed ${
              isEnhancedMode ? 'text-white/35' : 'text-zinc-400'
            }`}>
              {guide.description || 'A structured guide to venue assets, layouts, and resources.'}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {isEnhancedMode && (
              <button
                onClick={() => { setIsUnlocked(false); setActiveView('sales') }}
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 font-medium transition"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Sales View
              </button>
            )}
            <ViewToggle
              activeView={activeView}
              onViewChange={setActiveView}
              isUnlocked={isUnlocked}
            />
          </div>

        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {showAccessGate ? (
          // Full-area access gate
          <SecureAccessPanel
            correctPassword={guide.accessCode}
            onUnlock={() => setIsUnlocked(true)}
          />
        ) : (
          <>
            {/* Left sidebar */}
            <aside className={`w-64 shrink-0 border-r overflow-y-auto scrollbar-thin transition-colors duration-300 ${
              isEnhancedMode
                ? 'bg-slate-950 border-slate-800'
                : 'bg-white border-zinc-200'
            }`}>
              <AssetNavigation
                assets={guide.assets}
                activeView={activeView}
                isUnlocked={isUnlocked}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </aside>

            {/* Main content panel */}
            <div className="flex-1 overflow-hidden flex flex-col bg-white">
              <AssetRenderer asset={selectedAsset} isEnhancedMode={isEnhancedMode} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
