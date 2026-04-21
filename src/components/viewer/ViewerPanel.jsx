import { useState, useEffect } from 'react'
import ViewToggle        from './ViewToggle'
import SecureAccessPanel from './SecureAccessPanel'
import AssetNavigation   from './AssetNavigation'
import AssetRenderer     from './AssetRenderer'
import { getSections }   from '../../lib/guideUtils'

// ViewerPanel: the published guide — what clients and recipients see.
// Props:
//   guide    — full guide object
//   embedded — true when rendered inside PreviewPublishTab (no height override needed)

export default function ViewerPanel({ guide, embedded }) {
  const [activeView,  setActiveView]  = useState('sales')
  const [isUnlocked,  setIsUnlocked]  = useState(false)
  const [selectedId,  setSelectedId]  = useState(null)

  const showGate       = activeView === 'secure' && !isUnlocked
  const isSecureMode   = activeView === 'secure' && isUnlocked

  // Auto-select first visible asset when view/unlock/assets change
  useEffect(() => {
    const visible = getVisibleAssets(guide.assets, activeView, isUnlocked)
    const stillSelected = visible.find(a => a.id === selectedId)
    if (!stillSelected && visible.length > 0) setSelectedId(visible[0].id)
  }, [activeView, isUnlocked, guide.assets])

  const selectedAsset = guide.assets.find(a => a.id === selectedId)

  function handleViewChange(view) {
    setActiveView(view)
    if (view === 'sales') setIsUnlocked(false)
  }

  return (
    <div className="flex flex-col h-full">

      {/* ── Viewer header ── */}
      <div className={`shrink-0 border-b transition-colors duration-300 ${
        isSecureMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-zinc-200'
      }`}>
        <div className="px-6 flex items-center justify-between gap-6 h-14">

          {/* Venue identity */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5">
              <h1 className={`text-sm font-bold truncate tracking-tight ${
                isSecureMode ? 'text-white' : 'text-slate-900'
              }`}>
                {guide.venueName}
              </h1>
              <span className={isSecureMode ? 'text-white/20' : 'text-zinc-300'}>·</span>
              <span className={`text-xs truncate font-medium ${
                isSecureMode ? 'text-white/45' : 'text-zinc-500'
              }`}>
                {guide.guideName}
              </span>
            </div>
            <p className={`text-xs mt-0.5 truncate max-w-md leading-relaxed ${
              isSecureMode ? 'text-white/30' : 'text-zinc-400'
            }`}>
              {guide.description || 'A structured guide to venue assets, layouts, and resources.'}
            </p>
          </div>

          {/* View toggle */}
          <div className="shrink-0">
            <ViewToggle
              activeView={activeView}
              onViewChange={handleViewChange}
              isUnlocked={isUnlocked}
            />
          </div>

        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="flex flex-1 overflow-hidden">
        {showGate ? (
          <SecureAccessPanel
            correctPassword={guide.accessCode}
            accessCodeHint={guide.accessCodeHint}
            onUnlock={() => setIsUnlocked(true)}
          />
        ) : (
          <>
            {/* Sidebar nav */}
            <aside className={`w-60 shrink-0 border-r overflow-y-auto scrollbar-thin transition-colors duration-300 ${
              isSecureMode
                ? 'bg-slate-950 border-white/[0.07]'
                : 'bg-white border-zinc-200'
            }`}>
              <AssetNavigation
                guide={guide}
                activeView={activeView}
                isUnlocked={isUnlocked}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </aside>

            {/* Content panel */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <AssetRenderer asset={selectedAsset} isSecureMode={isSecureMode} />
            </div>
          </>
        )}
      </div>

    </div>
  )
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function getVisibleAssets(assets, activeView, isUnlocked) {
  return assets.filter(a => {
    if (activeView === 'sales') return a.visibility === 'both' || a.visibility === 'sales'
    if (activeView === 'secure' && isUnlocked) return true
    return a.visibility === 'both' || a.visibility === 'sales'
  })
}
