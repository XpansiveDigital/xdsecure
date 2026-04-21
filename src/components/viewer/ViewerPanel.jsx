import { useState, useEffect } from 'react'
import ViewToggle      from './ViewToggle'
import AssetNavigation from './AssetNavigation'
import AssetRenderer   from './AssetRenderer'
import { getLayerAssets } from '../../lib/guideUtils'

// ViewerPanel: admin preview of the published guide.
// Shows all 3 layers via tab switcher — no password gates.
// Props:
//   guide    — full guide object (live admin state)
//   embedded — true when rendered inside PreviewPublishTab

export default function ViewerPanel({ guide, embedded }) {
  const [activeLayer, setActiveLayer] = useState('public')
  const [selectedId,  setSelectedId]  = useState(null)

  const dark = activeLayer === 'internal'

  // Auto-select first visible asset when layer or guide assets change
  useEffect(() => {
    const visible = getLayerAssets(guide.assets, activeLayer)
    const stillSelected = visible.find(a => a.id === selectedId)
    if (!stillSelected && visible.length > 0) setSelectedId(visible[0].id)
  }, [activeLayer, guide.assets])

  const selectedAsset = guide.assets.find(a => a.id === selectedId)

  return (
    <div className="flex flex-col h-full">

      {/* ── Viewer header ── */}
      <div className={`shrink-0 border-b transition-colors duration-300 ${
        dark ? 'bg-slate-950 border-white/[0.07]' : 'bg-white border-zinc-200'
      }`}>
        <div className="px-6 flex items-center justify-between gap-6 h-14">

          {/* Venue identity */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5">
              <h1 className={`text-sm font-bold truncate tracking-tight ${
                dark ? 'text-white' : 'text-slate-900'
              }`}>
                {guide.venueName}
              </h1>
              <span className={dark ? 'text-white/20' : 'text-zinc-300'}>·</span>
              <span className={`text-xs truncate font-medium ${
                dark ? 'text-white/40' : 'text-zinc-500'
              }`}>
                {guide.guideName}
              </span>
            </div>
            <p className={`text-xs mt-0.5 truncate max-w-md leading-relaxed ${
              dark ? 'text-white/28' : 'text-zinc-400'
            }`}>
              {guide.description || 'A structured guide to venue assets, layouts, and resources.'}
            </p>
          </div>

          {/* Layer toggle */}
          <div className="shrink-0">
            <ViewToggle
              activeLayer={activeLayer}
              onLayerChange={setActiveLayer}
            />
          </div>

        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className={`w-60 shrink-0 border-r overflow-y-auto scrollbar-thin transition-colors duration-300 ${
          dark ? 'bg-slate-950 border-white/[0.07]' : 'bg-white border-zinc-200'
        }`}>
          <AssetNavigation
            guide={guide}
            layer={activeLayer}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </aside>

        {/* Content panel */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <AssetRenderer asset={selectedAsset} layer={activeLayer} />
        </div>

      </div>

    </div>
  )
}
