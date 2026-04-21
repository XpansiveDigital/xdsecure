import { getSections, getLayerAssets, TYPE_CONFIG } from '../../lib/guideUtils'

// AssetNavigation: left sidebar for the viewer.
// Works in both LayerViewer (route pages) and ViewerPanel (admin preview).
// Props:
//   guide      — full guide object
//   layer      — 'public' | 'private' | 'internal'
//   selectedId — currently selected asset id
//   onSelect   — callback when an asset is selected

export default function AssetNavigation({ guide, layer, selectedId, onSelect }) {
  const dark = layer === 'internal'

  // Filter sections to only assets visible at this layer
  const allSections = getSections(guide)
  const sections = allSections
    .map(s => ({
      ...s,
      assets: getLayerAssets(s.assets, layer),
    }))
    .filter(s => s.assets.length > 0)

  const totalVisible = sections.reduce((sum, s) => sum + s.assets.length, 0)

  return (
    <nav className="py-4">

      {/* Layer access indicator */}
      {layer !== 'public' && (
        <div className={`mx-3 mb-4 px-3 py-2.5 rounded-xl flex items-center gap-2.5 ${
          layer === 'internal'
            ? 'bg-red-500/[0.08] border border-red-500/[0.12]'
            : 'bg-amber-500/[0.07] border border-amber-500/[0.10]'
        }`}>
          <svg className={`w-3 h-3 shrink-0 ${dark ? 'text-red-400/60' : 'text-amber-500/70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            {layer === 'internal' ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            )}
          </svg>
          <span className={`text-[11px] font-medium tracking-tight ${
            dark ? 'text-red-300/60' : 'text-amber-700/70'
          }`}>
            {layer === 'internal' ? 'Internal access' : 'Private access'}
          </span>
        </div>
      )}

      {totalVisible === 0 ? (
        <p className={`px-4 py-8 text-xs text-center ${dark ? 'text-white/25' : 'text-zinc-400'}`}>
          No assets available.
        </p>
      ) : (
        sections.map(section => (
          <div key={section.category} className="mb-5">

            {/* Section label */}
            <div className="px-4 mb-1.5">
              <span className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${
                dark ? 'text-white/22' : 'text-zinc-400/80'
              }`}>
                {section.category}
              </span>
            </div>

            {/* Asset items */}
            <ul>
              {section.assets.map(asset => {
                const isActive   = selectedId === asset.id
                const tc         = TYPE_CONFIG[asset.type] || TYPE_CONFIG.link
                const layerLabel = asset.visibility === 'internal' ? 'Internal'
                                 : asset.visibility === 'private'  ? 'Private'
                                 : null

                return (
                  <li key={asset.id}>
                    <button
                      onClick={() => onSelect(asset.id)}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors duration-100 ${
                        isActive
                          ? dark
                            ? 'bg-white/[0.09] text-white'
                            : 'bg-slate-900 text-white'
                          : dark
                            ? 'text-white/50 hover:bg-white/[0.05] hover:text-white/85'
                            : 'text-slate-500 hover:bg-stone-100/80 hover:text-slate-800'
                      }`}
                    >
                      {/* Featured star */}
                      {asset.featured ? (
                        <svg
                          className={`w-3 h-3 shrink-0 fill-current ${
                            isActive
                              ? dark ? 'text-amber-300/80' : 'text-amber-300'
                              : dark ? 'text-amber-400/50' : 'text-amber-400'
                          }`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                      ) : (
                        <div className="w-3 h-3 shrink-0" />
                      )}

                      {/* Type dot */}
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${tc.dot} ${isActive ? 'opacity-70' : 'opacity-50'}`} />

                      {/* Name */}
                      <span className="flex-1 text-xs font-medium truncate leading-snug">
                        {asset.name}
                      </span>

                      {/* Layer badge — show in private/internal layers to flag private+ assets */}
                      {layerLabel && (layer === 'private' || layer === 'internal') && (
                        <span className={`text-[10px] font-semibold rounded px-1.5 py-0.5 shrink-0 leading-none ${
                          isActive
                            ? 'bg-white/15 text-white/80'
                            : asset.visibility === 'internal'
                              ? dark ? 'bg-red-500/12 text-red-300/70' : 'bg-red-50 text-red-600'
                              : dark ? 'bg-amber-500/12 text-amber-300/70' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {layerLabel}
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))
      )}
    </nav>
  )
}
