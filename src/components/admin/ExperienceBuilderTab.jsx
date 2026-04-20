import { getSections, getSectionOrder, TYPE_CONFIG, VISIBILITY_CONFIG } from '../../lib/guideUtils'

// ─── Visibility cycle order ───────────────────────────────────────────────────
const VIS_CYCLE = ['both', 'sales', 'vetted']

// ─── ExperienceBuilderTab ─────────────────────────────────────────────────────

export default function ExperienceBuilderTab({ guide, setGuide }) {
  const sections = getSections(guide)
  const sectionOrder = getSectionOrder(guide)

  // ── Section moves ──

  function moveSection(categoryName, direction) {
    const order = [...getSectionOrder(guide)]
    const idx = order.indexOf(categoryName)
    const newIdx = idx + direction
    if (newIdx < 0 || newIdx >= order.length) return
    ;[order[idx], order[newIdx]] = [order[newIdx], order[idx]]
    setGuide(g => ({ ...g, sectionOrder: order }))
  }

  // ── Asset moves within section ──

  function moveAssetInSection(assetId, categoryName, direction) {
    const assets = [...guide.assets]
    const sectionAssets = assets.filter(a => a.category === categoryName)
    const sectionIdx = sectionAssets.findIndex(a => a.id === assetId)
    const newSectionIdx = sectionIdx + direction
    if (newSectionIdx < 0 || newSectionIdx >= sectionAssets.length) return
    const globalIdx    = assets.findIndex(a => a.id === assetId)
    const targetGlobal = assets.findIndex(a => a.id === sectionAssets[newSectionIdx].id)
    ;[assets[globalIdx], assets[targetGlobal]] = [assets[targetGlobal], assets[globalIdx]]
    setGuide(g => ({ ...g, assets }))
  }

  // ── Toggle featured ──

  function toggleFeatured(assetId) {
    setGuide(g => ({
      ...g,
      assets: g.assets.map(a =>
        a.id === assetId ? { ...a, featured: !a.featured } : a
      ),
    }))
  }

  // ── Cycle visibility ──

  function cycleVisibility(assetId) {
    setGuide(g => ({
      ...g,
      assets: g.assets.map(a => {
        if (a.id !== assetId) return a
        const idx = VIS_CYCLE.indexOf(a.visibility)
        return { ...a, visibility: VIS_CYCLE[(idx + 1) % VIS_CYCLE.length] }
      }),
    }))
  }

  // ── Guide structure preview data ──
  const salesAssets  = guide.assets.filter(a => a.visibility === 'both' || a.visibility === 'sales')
  const vettedAssets = guide.assets.filter(a => a.visibility === 'vetted')

  function groupBySection(assets) {
    const result = []
    for (const cat of sectionOrder) {
      const catAssets = assets.filter(a => a.category === cat)
      if (catAssets.length > 0) result.push({ category: cat, assets: catAssets })
    }
    // Stray categories
    const covered = new Set(sectionOrder)
    for (const a of assets) {
      if (!covered.has(a.category)) {
        const existing = result.find(s => s.category === a.category)
        if (existing) existing.assets.push(a)
        else result.push({ category: a.category, assets: [a] })
        covered.add(a.category)
      }
    }
    return result
  }

  const salesSections  = groupBySection(salesAssets)
  const vettedSections = groupBySection(vettedAssets)

  return (
    <div className="h-full flex overflow-hidden">

      {/* ── Left: Section builder ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-8 py-8">

          {/* Header */}
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Experience Builder</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Shape how the guide is organised and what clients see first. Changes reflect immediately in the guide preview.
            </p>
          </div>

          {/* Helper strip */}
          <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-6">
            <svg className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            <p className="text-xs text-slate-600 leading-relaxed">
              Reorder sections and assets using the arrows. Click the <strong>visibility badge</strong> on any asset to cycle between Sales, Vetted, and Both. Star an asset to feature it at the top.
            </p>
          </div>

          {sections.length === 0 ? (
            <div className="text-center py-16 text-zinc-400 text-sm">
              Add assets in the <strong>Assets</strong> tab to build your guide structure.
            </div>
          ) : (
            <div className="space-y-4">
              {sections.map((section, sIdx) => {
                const isFirstSection = sIdx === 0
                const isLastSection  = sIdx === sections.length - 1
                return (
                  <div
                    key={section.category}
                    className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden"
                  >
                    {/* Section header */}
                    <div className="flex items-center gap-3 px-5 py-3.5 bg-zinc-50 border-b border-zinc-200">
                      {/* Grip icon */}
                      <svg className="w-3.5 h-3.5 text-zinc-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">{section.category}</span>
                        <span className="ml-2 text-xs text-zinc-400">{section.assets.length} asset{section.assets.length !== 1 ? 's' : ''}</span>
                      </div>
                      {/* Section move controls */}
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => moveSection(section.category, -1)}
                          disabled={isFirstSection}
                          className="w-6 h-6 rounded flex items-center justify-center text-zinc-300 hover:text-slate-600 hover:bg-white disabled:opacity-20 disabled:cursor-not-allowed transition"
                          title="Move section up"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                          </svg>
                        </button>
                        <button
                          onClick={() => moveSection(section.category, 1)}
                          disabled={isLastSection}
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
                    <div>
                      {section.assets.map((asset, aIdx) => {
                        const tc = TYPE_CONFIG[asset.type] || TYPE_CONFIG.link
                        const vc = VISIBILITY_CONFIG[asset.visibility] || VISIBILITY_CONFIG.both
                        const isFirstInSection = aIdx === 0
                        const isLastInSection  = aIdx === section.assets.length - 1
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
                                disabled={isFirstInSection}
                                className="w-5 h-5 rounded flex items-center justify-center text-zinc-200 hover:text-slate-500 hover:bg-zinc-100 disabled:opacity-20 disabled:cursor-not-allowed transition"
                              >
                                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                </svg>
                              </button>
                              <button
                                onClick={() => moveAssetInSection(asset.id, section.category, 1)}
                                disabled={isLastInSection}
                                className="w-5 h-5 rounded flex items-center justify-center text-zinc-200 hover:text-slate-500 hover:bg-zinc-100 disabled:opacity-20 disabled:cursor-not-allowed transition"
                              >
                                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                              </button>
                            </div>

                            {/* Featured toggle */}
                            <button
                              onClick={() => toggleFeatured(asset.id)}
                              title={asset.featured ? 'Remove featured' : 'Mark as featured'}
                              className={`w-6 h-6 rounded-lg flex items-center justify-center transition shrink-0 ${
                                asset.featured
                                  ? 'text-amber-500'
                                  : 'text-zinc-200 hover:text-zinc-400'
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
                              <svg className={`${tc.text}`} style={{width:'14px',height:'14px'}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={tc.iconPath} />
                              </svg>
                            </div>

                            {/* Asset name */}
                            <span className="flex-1 text-sm font-medium text-slate-700 truncate">{asset.name}</span>

                            {/* Visibility badge — clickable to cycle */}
                            <button
                              onClick={() => cycleVisibility(asset.id)}
                              title="Click to change visibility"
                              className={`text-[11px] font-semibold rounded-full px-2.5 py-1 shrink-0 border transition hover:opacity-80 ${vc.pill}`}
                            >
                              {vc.short}
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Structure preview panel ── */}
      <div className="w-72 shrink-0 border-l border-zinc-200 bg-white overflow-y-auto">
        <div className="px-5 py-6">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-5">Guide Structure</h2>

          {/* Sales View */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-sky-500" />
              <span className="text-xs font-semibold text-slate-700">Sales View</span>
              <span className="text-xs text-zinc-400 ml-auto">{salesAssets.length} asset{salesAssets.length !== 1 ? 's' : ''}</span>
            </div>
            {salesSections.length === 0 ? (
              <p className="text-xs text-zinc-400 pl-4 italic">No assets visible in Sales View</p>
            ) : (
              <div className="space-y-3">
                {salesSections.map(s => (
                  <div key={s.category}>
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 pl-4">{s.category}</p>
                    {s.assets.map(a => (
                      <StructureAssetRow key={a.id} asset={a} />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-zinc-100 my-5" />

          {/* Vetted View */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs font-semibold text-slate-700">Vetted View</span>
              <span className="text-xs text-zinc-400 ml-auto">+{vettedAssets.length} additional</span>
            </div>
            {vettedSections.length === 0 ? (
              <p className="text-xs text-zinc-400 pl-4 italic">No vetted-only assets configured</p>
            ) : (
              <div className="space-y-3">
                {vettedSections.map(s => (
                  <div key={s.category}>
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 pl-4">{s.category}</p>
                    {s.assets.map(a => (
                      <StructureAssetRow key={a.id} asset={a} amber />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary footer */}
          <div className="mt-6 pt-4 border-t border-zinc-100">
            <div className="text-[10px] text-zinc-400 space-y-1.5">
              <div className="flex justify-between">
                <span>Sales View total</span>
                <span className="font-semibold text-slate-500">{salesAssets.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Vetted View total</span>
                <span className="font-semibold text-slate-500">{salesAssets.length + vettedAssets.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Featured assets</span>
                <span className="font-semibold text-slate-500">{guide.assets.filter(a => a.featured).length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

// ─── Structure row ────────────────────────────────────────────────────────────

function StructureAssetRow({ asset, amber }) {
  const tc = TYPE_CONFIG[asset.type] || TYPE_CONFIG.link
  return (
    <div className="flex items-center gap-2 pl-4 py-1">
      {asset.featured && (
        <svg className="w-2.5 h-2.5 fill-amber-400 text-amber-400 shrink-0" viewBox="0 0 24 24">
          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      )}
      {!asset.featured && <div className="w-2.5 h-2.5 shrink-0" />}
      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${tc.dot}`} />
      <span className={`text-xs truncate ${amber ? 'text-amber-700' : 'text-slate-600'}`}>{asset.name}</span>
    </div>
  )
}
