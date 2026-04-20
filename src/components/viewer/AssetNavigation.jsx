import { getSections } from '../../lib/guideUtils'
import { TYPE_CONFIG, VISIBILITY_CONFIG } from '../../lib/guideUtils'

// AssetNavigation: left sidebar for the published viewer.
// Groups assets into sections using the guide's sectionOrder.

export default function AssetNavigation({ guide, activeView, isUnlocked, selectedId, onSelect }) {
  const isSecure = activeView === 'secure' && isUnlocked

  // Filter assets for the current view
  function isVisible(asset) {
    if (activeView === 'sales') return asset.visibility === 'both' || asset.visibility === 'sales'
    if (activeView === 'secure' && isUnlocked) return true
    return asset.visibility === 'both' || asset.visibility === 'sales'
  }

  // Build sections from guide (respects sectionOrder), then filter to visible assets
  const allSections = getSections(guide)
  const sections = allSections
    .map(s => ({ ...s, assets: s.assets.filter(isVisible) }))
    .filter(s => s.assets.length > 0)

  const totalVisible = sections.reduce((sum, s) => sum + s.assets.length, 0)

  return (
    <nav className="py-3">

      {/* Secure access indicator */}
      {isSecure && (
        <div className="mx-3 mb-3 px-3 py-2 rounded-xl bg-white/5 border border-white/8 flex items-center gap-2.5">
          <svg className="w-3 h-3 text-white/50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <span className="text-[11px] font-semibold text-white/60">Vetted access enabled</span>
        </div>
      )}

      {totalVisible === 0 ? (
        <p className={`px-4 py-6 text-xs text-center ${isSecure ? 'text-white/30' : 'text-zinc-400'}`}>
          No assets available.
        </p>
      ) : (
        sections.map(section => (
          <div key={section.category} className="mb-4">
            {/* Section header */}
            <div className="px-4 mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${
                isSecure ? 'text-white/25' : 'text-zinc-400'
              }`}>
                {section.category}
              </span>
            </div>

            {/* Asset items */}
            <ul>
              {section.assets.map(asset => {
                const isActive  = selectedId === asset.id
                const isVetted  = asset.visibility === 'vetted'
                const tc        = TYPE_CONFIG[asset.type] || TYPE_CONFIG.link
                return (
                  <li key={asset.id}>
                    <button
                      onClick={() => onSelect(asset.id)}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors group ${
                        isActive
                          ? isSecure
                            ? 'bg-slate-700 text-white'
                            : 'bg-slate-900 text-white'
                          : isSecure
                            ? 'text-white/55 hover:bg-white/6 hover:text-white'
                            : 'text-slate-600 hover:bg-zinc-50 hover:text-slate-800'
                      }`}
                    >
                      {/* Featured star */}
                      {asset.featured ? (
                        <svg
                          className={`w-3 h-3 shrink-0 fill-current ${
                            isActive ? 'text-amber-300' : isSecure ? 'text-amber-400/60' : 'text-amber-400'
                          }`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                      ) : (
                        <div className="w-3 h-3 shrink-0" />
                      )}

                      {/* Type dot */}
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${tc.dot} ${
                        isActive ? 'opacity-80' : 'opacity-60'
                      }`} />

                      {/* Name */}
                      <span className={`flex-1 text-xs font-medium truncate ${
                        isActive ? '' : isSecure ? 'group-hover:text-white' : ''
                      }`}>
                        {asset.name}
                      </span>

                      {/* Vetted badge */}
                      {isVetted && isSecure && (
                        <span className={`text-[10px] font-semibold rounded px-1.5 py-0.5 shrink-0 ${
                          isActive
                            ? 'bg-white/15 text-white'
                            : 'bg-amber-500/15 text-amber-300'
                        }`}>
                          Vetted
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
