import { getSections, getSectionOrder, TYPE_CONFIG, VISIBILITY_CONFIG } from '../../lib/guideUtils'

// ─── Visibility cycle ─────────────────────────────────────────────────────────
const VIS_CYCLE = ['both', 'sales', 'vetted']

// ─── Section visibility breakdown ────────────────────────────────────────────

function sectionBreakdown(assets) {
  const both       = assets.filter(a => a.visibility === 'both').length
  const salesOnly  = assets.filter(a => a.visibility === 'sales').length
  const vettedOnly = assets.filter(a => a.visibility === 'vetted').length
  const salesTotal = both + salesOnly
  const parts      = []
  if (salesTotal  > 0) parts.push({ label: `${salesTotal} Sales`,  cls: 'text-sky-600'   })
  if (vettedOnly  > 0) parts.push({ label: `${vettedOnly} Vetted`, cls: 'text-amber-600' })
  return parts
}

function sectionViewWarning(assets) {
  const salesTotal = assets.filter(a => a.visibility === 'both' || a.visibility === 'sales').length
  if (salesTotal === 0) return 'Hidden from Sales View'
  return null
}

// ─── ExperienceBuilderTab ─────────────────────────────────────────────────────

export default function ExperienceBuilderTab({ guide, setGuide }) {
  const sections     = getSections(guide)
  const sectionOrder = getSectionOrder(guide)

  // ── Section moves ──

  function moveSection(name, dir) {
    const order = [...getSectionOrder(guide)]
    const idx   = order.indexOf(name)
    const next  = idx + dir
    if (next < 0 || next >= order.length) return
    ;[order[idx], order[next]] = [order[next], order[idx]]
    setGuide(g => ({ ...g, sectionOrder: order }))
  }

  // ── Asset moves within section ──

  function moveAssetInSection(assetId, category, dir) {
    const assets       = [...guide.assets]
    const sectionItems = assets.filter(a => a.category === category)
    const sectionIdx   = sectionItems.findIndex(a => a.id === assetId)
    const nextIdx      = sectionIdx + dir
    if (nextIdx < 0 || nextIdx >= sectionItems.length) return
    const globalIdx  = assets.findIndex(a => a.id === assetId)
    const targetIdx  = assets.findIndex(a => a.id === sectionItems[nextIdx].id)
    ;[assets[globalIdx], assets[targetIdx]] = [assets[targetIdx], assets[globalIdx]]
    setGuide(g => ({ ...g, assets }))
  }

  // ── Inline mutations ──

  function toggleFeatured(id) {
    setGuide(g => ({
      ...g,
      assets: g.assets.map(a => a.id === id ? { ...a, featured: !a.featured } : a),
    }))
  }

  function cycleVisibility(id) {
    setGuide(g => ({
      ...g,
      assets: g.assets.map(a => {
        if (a.id !== id) return a
        const idx = VIS_CYCLE.indexOf(a.visibility)
        return { ...a, visibility: VIS_CYCLE[(idx + 1) % VIS_CYCLE.length] }
      }),
    }))
  }

  // ── Structure preview data ──
  const salesAssets  = guide.assets.filter(a => a.visibility === 'both' || a.visibility === 'sales')
  const vettedAssets = guide.assets.filter(a => a.visibility === 'vetted')
  const featuredAssets = guide.assets.filter(a => a.featured)

  function groupedForPreview(assets) {
    const result = []
    for (const cat of sectionOrder) {
      const catAssets = assets.filter(a => a.category === cat)
      if (catAssets.length > 0) result.push({ category: cat, assets: catAssets })
    }
    for (const a of assets) {
      const covered = result.find(s => s.category === a.category)
      if (!covered) {
        const existing = result.find(s => s.category === a.category)
        if (!existing) result.push({ category: a.category, assets: [a] })
      }
    }
    return result
  }

  const salesSections  = groupedForPreview(salesAssets)
  const vettedSections = groupedForPreview(vettedAssets)

  return (
    <div className="h-full flex overflow-hidden">

      {/* ── Left: Section builder ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-8 py-8">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Experience Builder</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Organise sections, set asset order, control visibility, and decide what gets featured first.
            </p>
          </div>

          {/* Helper */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: '⟳', label: 'Reorder sections', desc: 'Use arrows on section headers to reorder' },
              { icon: '★', label: 'Feature assets',    desc: 'Star an asset to surface it first in the guide' },
              { icon: '◎', label: 'Control visibility', desc: 'Click any visibility badge to cycle it' },
            ].map(h => (
              <div key={h.label} className="bg-white border border-zinc-200/70 rounded-xl px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <p className="text-[11px] font-bold text-slate-700 mb-0.5">{h.label}</p>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {sections.length === 0 && (
            <div className="bg-white border-2 border-dashed border-zinc-200 rounded-2xl py-14 text-center">
              <p className="text-sm font-medium text-zinc-500 mb-1">No assets configured yet</p>
              <p className="text-xs text-zinc-400">Add assets in the Assets tab — they'll appear here grouped by category.</p>
            </div>
          )}

          {/* Sections */}
          {sections.length > 0 && (
            <div className="space-y-3">
              {sections.map((section, sIdx) => {
                const breakdown = sectionBreakdown(section.assets)
                const warning   = sectionViewWarning(section.assets)
                const isFirst   = sIdx === 0
                const isLast    = sIdx === sections.length - 1

                return (
                  <div key={section.category} className="bg-white border border-zinc-200/70 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">

                    {/* Section header */}
                    <div className="flex items-center gap-3 px-5 py-3.5 bg-zinc-50 border-b border-zinc-200">
                      {/* Grip */}
                      <div className="flex flex-col gap-0.5 shrink-0 opacity-30">
                        <div className="w-4 flex gap-1 justify-center">
                          {[0,1].map(i => <div key={i} className="w-0.5 h-3 rounded-full bg-zinc-500" />)}
                        </div>
                      </div>

                      {/* Title + breakdown */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            {section.category}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            {section.assets.length} asset{section.assets.length !== 1 ? 's' : ''}
                          </span>
                          {breakdown.map(b => (
                            <span key={b.label} className={`text-[10px] font-semibold ${b.cls}`}>
                              {b.label}
                            </span>
                          ))}
                          {warning && (
                            <span className="text-[10px] font-semibold text-orange-500">
                              · {warning}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Move controls */}
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          onClick={() => moveSection(section.category, -1)}
                          disabled={isFirst}
                          className="w-6 h-6 rounded flex items-center justify-center text-zinc-300 hover:text-slate-600 hover:bg-white disabled:opacity-20 disabled:cursor-not-allowed transition"
                          title="Move section up"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                          </svg>
                        </button>
                        <button
                          onClick={() => moveSection(section.category, 1)}
                          disabled={isLast}
                          className="w-6 h-6 rounded flex items-center justify-center text-zinc-300 hover:text-slate-600 hover:bg-white disabled:opacity-20 disabled:cursor-not-allowed transition"
                          title="Move section down"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Asset rows */}
                    {section.assets.map((asset, aIdx) => {
                      const tc            = TYPE_CONFIG[asset.type] || TYPE_CONFIG.link
                      const vc            = VISIBILITY_CONFIG[asset.visibility] || VISIBILITY_CONFIG.both
                      const isFirstInSec  = aIdx === 0
                      const isLastInSec   = aIdx === section.assets.length - 1

                      return (
                        <div
                          key={asset.id}
                          className={`flex items-center gap-3 px-5 py-3 group hover:bg-zinc-50/60 transition-colors ${
                            aIdx > 0 ? 'border-t border-zinc-100' : ''
                          }`}
                        >
                          {/* Asset move controls */}
                          <div className="flex flex-col gap-0.5 shrink-0">
                            <button
                              onClick={() => moveAssetInSection(asset.id, section.category, -1)}
                              disabled={isFirstInSec}
                              className="w-5 h-5 rounded flex items-center justify-center text-zinc-200 hover:text-slate-500 hover:bg-zinc-100 disabled:opacity-20 disabled:cursor-not-allowed transition"
                            >
                              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                              </svg>
                            </button>
                            <button
                              onClick={() => moveAssetInSection(asset.id, section.category, 1)}
                              disabled={isLastInSec}
                              className="w-5 h-5 rounded flex items-center justify-center text-zinc-200 hover:text-slate-500 hover:bg-zinc-100 disabled:opacity-20 disabled:cursor-not-allowed transition"
                            >
                              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                              </svg>
                            </button>
                          </div>

                          {/* Featured toggle */}
                          <button
                            onClick={() => toggleFeatured(asset.id)}
                            title={asset.featured ? 'Remove featured' : 'Mark as featured'}
                            className={`shrink-0 transition ${
                              asset.featured
                                ? 'text-amber-500'
                                : 'text-zinc-200 hover:text-zinc-400 opacity-0 group-hover:opacity-100'
                            }`}
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.75}
                              fill={asset.featured ? 'currentColor' : 'none'}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                            </svg>
                          </button>

                          {/* Type icon */}
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${tc.bg}`}>
                            <svg style={{width:'13px',height:'13px'}} className={tc.text} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                              <path strokeLinecap="round" strokeLinejoin="round" d={tc.iconPath} />
                            </svg>
                          </div>

                          {/* Name */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-700 truncate">{asset.name}</p>
                            {asset.featured && (
                              <p className="text-[10px] text-amber-500 font-medium">Featured</p>
                            )}
                          </div>

                          {/* Clickable visibility badge */}
                          <button
                            onClick={() => cycleVisibility(asset.id)}
                            title="Click to change visibility"
                            className={`text-[11px] font-semibold rounded-full px-2.5 py-1 shrink-0 border transition hover:opacity-75 ${vc.pill}`}
                          >
                            {vc.short}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )}

          <p className="text-xs text-zinc-400 text-center mt-6">
            Section names are derived from asset categories. Change a category in the Assets tab to rename a section.
          </p>
        </div>
      </div>

      {/* ── Right: Guide structure panel ── */}
      <div className="w-72 shrink-0 border-l border-zinc-200 bg-white overflow-y-auto flex flex-col">
        <div className="px-5 py-5 border-b border-zinc-100">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Guide At A Glance</h2>
          <p className="text-[11px] text-zinc-400 mt-1">Reflects current configuration.</p>
        </div>

        <div className="flex-1 px-5 py-5 space-y-6 overflow-y-auto">

          {/* Sales View */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-sky-400" />
                <span className="text-xs font-bold text-slate-700">Sales View</span>
              </div>
              <span className="text-[10px] font-medium text-sky-600 ml-auto bg-sky-50 border border-sky-200 rounded-full px-2 py-0.5">
                {salesAssets.length} asset{salesAssets.length !== 1 ? 's' : ''}
              </span>
            </div>
            {salesSections.length === 0 ? (
              <p className="text-xs text-zinc-400 italic pl-3.5">No assets assigned to Sales View</p>
            ) : (
              <div className="space-y-3">
                {salesSections.map(s => (
                  <div key={s.category}>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 pl-3.5">{s.category}</p>
                    {s.assets.map(a => (
                      <PreviewRow key={a.id} asset={a} />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-[10px] text-zinc-400 font-medium">Vetted access only</span>
            </div>
          </div>

          {/* Vetted View */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-xs font-bold text-slate-700">Additional (Vetted)</span>
              </div>
              <span className="text-[10px] font-medium text-amber-700 ml-auto bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                +{vettedAssets.length}
              </span>
            </div>
            {vettedSections.length === 0 ? (
              <p className="text-xs text-zinc-400 italic pl-3.5">No vetted-only assets configured</p>
            ) : (
              <div className="space-y-3">
                {vettedSections.map(s => (
                  <div key={s.category}>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 pl-3.5">{s.category}</p>
                    {s.assets.map(a => (
                      <PreviewRow key={a.id} asset={a} amber />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Summary footer */}
        <div className="px-5 py-4 border-t border-zinc-100 bg-zinc-50/50">
          <div className="space-y-1.5">
            {[
              { label: 'Sales View total',  val: salesAssets.length  },
              { label: 'Vetted View total', val: salesAssets.length + vettedAssets.length },
              { label: 'Featured',          val: featuredAssets.length },
              { label: 'Sections',          val: sections.length },
            ].map(r => (
              <div key={r.label} className="flex justify-between text-[11px]">
                <span className="text-zinc-400">{r.label}</span>
                <span className="font-semibold text-slate-600 tabular-nums">{r.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

// ─── Preview row ──────────────────────────────────────────────────────────────

function PreviewRow({ asset, amber }) {
  const tc = TYPE_CONFIG[asset.type] || TYPE_CONFIG.link
  return (
    <div className="flex items-center gap-2 pl-3.5 py-1">
      {asset.featured ? (
        <svg className="w-2.5 h-2.5 fill-amber-400 shrink-0" viewBox="0 0 24 24">
          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ) : (
        <div className="w-2.5 h-2.5 shrink-0" />
      )}
      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${tc.dot}`} />
      <span className={`text-xs truncate ${amber ? 'text-amber-700' : 'text-slate-600'}`}>
        {asset.name}
      </span>
    </div>
  )
}
