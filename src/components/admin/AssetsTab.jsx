import { useState } from 'react'
import AssetEditorModal from './AssetEditorModal'
import { TYPE_CONFIG, VISIBILITY_CONFIG, getSections, getSectionOrder, nextAssetId } from '../../lib/guideUtils'

// ─── Visibility cycle ─────────────────────────────────────────────────────────
const VIS_CYCLE = ['public', 'private', 'internal']

// ─── Filter options ───────────────────────────────────────────────────────────
const TYPE_FILTERS = [
  { value: '',      label: 'All'          },
  { value: 'embed', label: 'Virtual Tour' },
  { value: 'pdf',   label: 'PDF'          },
  { value: 'image', label: 'Image'        },
  { value: 'video', label: 'Video'        },
  { value: 'link',  label: 'Link'         },
]

const VIS_FILTERS = [
  { value: '',         label: 'All'      },
  { value: 'public',   label: 'Public'   },
  { value: 'private',  label: 'Private'  },
  { value: 'internal', label: 'Internal' },
]

// ─── Inline visibility badge ──────────────────────────────────────────────────

function VisBadge({ visibility, onClick }) {
  const vc = VISIBILITY_CONFIG[visibility] || VISIBILITY_CONFIG.both
  return (
    <button
      onClick={onClick}
      title="Click to change visibility"
      className={`text-[11px] font-semibold rounded-full px-2.5 py-1 border transition hover:opacity-75 shrink-0 ${vc.pill}`}
    >
      {vc.short}
    </button>
  )
}

// ─── Inline status badge ──────────────────────────────────────────────────────

function StatusBadge({ status, onClick }) {
  const isReady = status === 'ready'
  return (
    <button
      onClick={onClick}
      title="Click to toggle status"
      className={`text-[11px] font-semibold rounded-full px-2.5 py-1 border transition hover:opacity-75 shrink-0 ${
        isReady
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-zinc-100 text-zinc-500 border-zinc-200'
      }`}
    >
      {isReady ? 'Ready' : 'Draft'}
    </button>
  )
}

// ─── Section visibility summary ───────────────────────────────────────────────

function sectionSummary(assets) {
  const pub  = assets.filter(a => a.visibility === 'public').length
  const priv = assets.filter(a => a.visibility === 'private').length
  const int  = assets.filter(a => a.visibility === 'internal').length
  const parts = []
  if (pub  > 0) parts.push(`${pub} Public`)
  if (priv > 0) parts.push(`${priv} Private`)
  if (int  > 0) parts.push(`${int} Internal`)
  return parts.join(' · ')
}

// ─── AssetsTab ────────────────────────────────────────────────────────────────

export default function AssetsTab({ guide, setGuide }) {
  const [showModal,     setShowModal]     = useState(false)
  const [editingAsset,  setEditingAsset]  = useState(null)
  const [search,        setSearch]        = useState('')
  const [typeFilter,    setTypeFilter]    = useState('')
  const [visFilter,     setVisFilter]     = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [collapsed,     setCollapsed]     = useState({})

  // ── Mutations ──

  function handleAdd(prefillCategory) {
    setEditingAsset(prefillCategory ? { _prefillCategory: prefillCategory } : null)
    setShowModal(true)
  }

  function handleEdit(asset) {
    setEditingAsset(asset)
    setShowModal(true)
  }

  function handleSave(formData) {
    if (editingAsset && editingAsset.id) {
      setGuide(g => ({
        ...g,
        assets: g.assets.map(a => a.id === editingAsset.id ? { ...formData, id: a.id } : a),
      }))
    } else {
      const newAsset = { ...formData, id: nextAssetId() }
      setGuide(g => {
        const newOrder = g.sectionOrder?.includes(formData.category)
          ? g.sectionOrder
          : [...(g.sectionOrder || getSectionOrder(g)), formData.category]
        return { ...g, assets: [...g.assets, newAsset], sectionOrder: newOrder }
      })
    }
    setShowModal(false)
    setEditingAsset(null)
  }

  function handleDelete(id) {
    setGuide(g => {
      const newAssets = g.assets.filter(a => a.id !== id)
      const remaining = new Set(newAssets.map(a => a.category))
      return {
        ...g,
        assets:       newAssets,
        sectionOrder: (g.sectionOrder || []).filter(c => remaining.has(c)),
      }
    })
    setConfirmDelete(null)
  }

  // ── Inline mutations (no modal) ──

  function inlineToggleFeatured(id) {
    setGuide(g => ({
      ...g,
      assets: g.assets.map(a => a.id === id ? { ...a, featured: !a.featured } : a),
    }))
  }

  function inlineToggleStatus(id) {
    setGuide(g => ({
      ...g,
      assets: g.assets.map(a =>
        a.id === id ? { ...a, status: a.status === 'ready' ? 'draft' : 'ready' } : a
      ),
    }))
  }

  function inlineCycleVisibility(id) {
    setGuide(g => ({
      ...g,
      assets: g.assets.map(a => {
        if (a.id !== id) return a
        const idx = VIS_CYCLE.indexOf(a.visibility)
        return { ...a, visibility: VIS_CYCLE[(idx + 1) % VIS_CYCLE.length] }
      }),
    }))
  }

  function toggleSection(cat) {
    setCollapsed(c => ({ ...c, [cat]: !c[cat] }))
  }

  // ── Filtering ──

  const filteredAssets = guide.assets.filter(a => {
    const matchType   = !typeFilter || a.type === typeFilter
    const matchVis    = !visFilter  || a.visibility === visFilter
    const matchSearch = !search     ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.description || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.category    || '').toLowerCase().includes(search.toLowerCase())
    return matchType && matchVis && matchSearch
  })

  // Group filtered assets by section order
  const sectionOrder = getSectionOrder(guide)
  const grouped = {}
  for (const a of filteredAssets) {
    if (!grouped[a.category]) grouped[a.category] = []
    grouped[a.category].push(a)
  }
  const allCats = [
    ...sectionOrder.filter(c => grouped[c]),
    ...Object.keys(grouped).filter(c => !sectionOrder.includes(c)),
  ]
  const groupedSections = allCats.map(cat => ({ category: cat, assets: grouped[cat] }))

  // Stats
  const totalAssets   = guide.assets.length
  const publicCount   = guide.assets.filter(a => a.visibility === 'public').length
  const privateCount  = guide.assets.filter(a => a.visibility === 'private').length
  const internalCount = guide.assets.filter(a => a.visibility === 'internal').length
  const missingUrl    = guide.assets.filter(a => !a.url?.trim()).length
  const isFiltering   = !!(search || typeFilter || visFilter)

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto px-8 py-8">

        {/* ── Page header ── */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Assets</h1>
            <p className="text-sm text-zinc-500 mt-1">
              {totalAssets === 0
                ? 'Add your venue assets — tours, floorplans, images, videos, and documents.'
                : <>
                    <span className="font-medium text-slate-700">{totalAssets}</span> asset{totalAssets !== 1 ? 's' : ''}
                    {' · '}
                    <span className="text-sky-600 font-medium">{publicCount} Public</span>
                    {' · '}
                    <span className="text-amber-600 font-medium">{privateCount} Private</span>
                    {internalCount > 0 && (
                      <span className="text-red-600 font-medium"> · {internalCount} Internal</span>
                    )}
                    {missingUrl > 0 && (
                      <span className="text-orange-600 font-medium"> · {missingUrl} missing source URL</span>
                    )}
                  </>
              }
            </p>
          </div>
          <button
            onClick={() => handleAdd()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 active:scale-[0.98] transition shadow-[0_1px_2px_rgba(0,0,0,0.12)] shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Asset
          </button>
        </div>

        {/* ── Alerts ── */}
        {missingUrl > 0 && (
          <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-5">
            <svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-xs text-orange-800">
              <strong className="font-semibold">{missingUrl} asset{missingUrl !== 1 ? 's' : ''}</strong> {missingUrl !== 1 ? 'are' : 'is'} missing a source URL and won't display correctly in the guide.
            </p>
          </div>
        )}

        {/* ── Filter bar ── */}
        {totalAssets > 0 && (
          <div className="bg-white border border-zinc-200/70 rounded-2xl px-4 py-3 mb-5 flex items-center gap-3 flex-wrap shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]">
            <div className="relative flex-1 min-w-40">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-zinc-200 rounded-lg placeholder-zinc-400 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/15 focus:border-slate-400 transition"
                placeholder="Search assets, categories..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-1">
              {TYPE_FILTERS.map(f => {
                const count = f.value ? guide.assets.filter(a => a.type === f.value).length : null
                return (
                  <button
                    key={f.value}
                    onClick={() => setTypeFilter(f.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                      typeFilter === f.value
                        ? 'bg-slate-900 text-white'
                        : 'text-zinc-500 hover:text-slate-700 hover:bg-zinc-100'
                    }`}
                  >
                    {f.label}{count !== null ? ` (${count})` : ''}
                  </button>
                )
              })}
            </div>
            <div className="w-px h-4 bg-zinc-200" />
            <div className="flex items-center gap-1">
              {VIS_FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setVisFilter(f.value)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    visFilter === f.value
                      ? 'bg-slate-900 text-white'
                      : 'text-zinc-500 hover:text-slate-700 hover:bg-zinc-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            {isFiltering && (
              <button
                onClick={() => { setSearch(''); setTypeFilter(''); setVisFilter('') }}
                className="text-xs text-zinc-400 hover:text-slate-600 transition ml-auto"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* ── Empty state (no assets at all) ── */}
        {totalAssets === 0 && (
          <GlobalEmptyState onAdd={() => handleAdd()} />
        )}

        {/* ── Filtered empty state ── */}
        {totalAssets > 0 && groupedSections.length === 0 && (
          <div className="bg-white border border-zinc-200/70 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)] py-12 text-center">
            <p className="text-sm font-medium text-zinc-500 mb-1">No assets match your filters</p>
            <p className="text-xs text-zinc-400">Try adjusting the search or filter options above.</p>
          </div>
        )}

        {/* ── Grouped asset list ── */}
        {groupedSections.length > 0 && (
          <div className="space-y-4">
            {groupedSections.map(section => {
              const isCollapsed = collapsed[section.category]
              const summary     = sectionSummary(section.assets)
              const hasMissing  = section.assets.some(a => !a.url?.trim())
              return (
                <div key={section.category} className="bg-white rounded-2xl border border-zinc-200/70 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">

                  {/* Section header */}
                  <button
                    onClick={() => toggleSection(section.category)}
                    className="w-full flex items-center gap-3 px-5 py-3.5 bg-zinc-50/80 border-b border-zinc-200 hover:bg-zinc-100/60 transition text-left group"
                  >
                    <svg
                      className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex-1 text-left">
                      {section.category}
                    </span>
                    <div className="flex items-center gap-2">
                      {hasMissing && (
                        <svg className="w-3.5 h-3.5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
                        </svg>
                      )}
                      <span className="text-xs text-zinc-400">{summary}</span>
                      <span className="text-xs font-semibold text-zinc-500 bg-zinc-200/80 rounded-full px-2 py-0.5">
                        {section.assets.length}
                      </span>
                    </div>
                  </button>

                  {/* Asset rows */}
                  {!isCollapsed && (
                    <>
                      {section.assets.map((asset, idx) => {
                        const tc       = TYPE_CONFIG[asset.type] || TYPE_CONFIG.link
                        const hasNoUrl = !asset.url?.trim()
                        return (
                          <div
                            key={asset.id}
                            className={`flex items-center gap-3 px-5 py-3.5 group hover:bg-zinc-50/70 transition-colors ${
                              idx > 0 ? 'border-t border-zinc-100' : ''
                            } ${asset.status === 'draft' ? 'opacity-70' : ''}`}
                          >
                            {/* Type icon */}
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${tc.bg}`}>
                              <svg style={{width:'15px',height:'15px'}} className={tc.text} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={tc.iconPath} />
                              </svg>
                            </div>

                            {/* Name + description */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-slate-800 truncate">{asset.name}</span>
                                {hasNoUrl && (
                                  <span title="No source URL — this asset won't display in the guide">
                                    <svg className="w-3.5 h-3.5 text-orange-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
                                    </svg>
                                  </span>
                                )}
                              </div>
                              {asset.description && (
                                <p className="text-xs text-zinc-400 truncate mt-0.5">{asset.description}</p>
                              )}
                              {hasNoUrl && !asset.description && (
                                <p className="text-xs text-orange-500 mt-0.5">No source URL — click edit to add one</p>
                              )}
                            </div>

                            {/* Inline controls — shown on hover + always visible when active */}
                            <div className="flex items-center gap-2 shrink-0">

                              {/* Featured star — inline toggle */}
                              <button
                                onClick={() => inlineToggleFeatured(asset.id)}
                                title={asset.featured ? 'Remove featured' : 'Mark as featured'}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${
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

                              {/* Status badge — click to toggle */}
                              <StatusBadge status={asset.status} onClick={() => inlineToggleStatus(asset.id)} />

                              {/* Visibility badge — click to cycle */}
                              <VisBadge visibility={asset.visibility} onClick={() => inlineCycleVisibility(asset.id)} />

                              {/* Edit */}
                              <button
                                onClick={() => handleEdit(asset)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-300 hover:text-slate-700 hover:bg-zinc-100 transition opacity-0 group-hover:opacity-100"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                                </svg>
                              </button>

                              {/* Delete */}
                              {confirmDelete === asset.id ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleDelete(asset.id)}
                                    className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-red-600 text-white hover:bg-red-700 transition"
                                  >
                                    Delete
                                  </button>
                                  <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="px-2 py-1 rounded-lg text-[11px] text-zinc-500 hover:bg-zinc-100 transition"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setConfirmDelete(asset.id)}
                                  className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-300 hover:text-red-500 hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      })}

                      {/* Add asset to this section */}
                      {!isFiltering && (
                        <button
                          onClick={() => {
                            setEditingAsset({ _prefillCategory: section.category })
                            setShowModal(true)
                          }}
                          className="w-full flex items-center gap-2 px-5 py-2.5 text-xs text-zinc-400 hover:text-slate-600 hover:bg-zinc-50 transition border-t border-zinc-100"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                          Add asset to {section.category}
                        </button>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Bottom spacer */}
        <div className="h-8" />

      </div>

      {/* Modal */}
      {showModal && (
        <AssetEditorModal
          asset={editingAsset?.id ? editingAsset : null}
          prefillCategory={editingAsset?._prefillCategory}
          onSave={handleSave}
          onCancel={() => { setShowModal(false); setEditingAsset(null) }}
        />
      )}
    </div>
  )
}

// ─── Global empty state ───────────────────────────────────────────────────────

function GlobalEmptyState({ onAdd }) {
  const TYPES = [
    { label: 'Virtual Tour',    icon: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3', cls: 'bg-indigo-100 text-indigo-600' },
    { label: 'Floorplan / PDF', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z', cls: 'bg-amber-100 text-amber-600' },
    { label: 'Image',           icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z', cls: 'bg-emerald-100 text-emerald-600' },
    { label: 'Video',           icon: 'M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z', cls: 'bg-rose-100 text-rose-600' },
  ]
  return (
    <div className="bg-white border border-zinc-200/70 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="px-8 py-10 text-center border-b border-zinc-100">
        <div className="flex items-center justify-center gap-3 mb-5">
          {TYPES.map(t => (
            <div key={t.label} className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.cls}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d={t.icon} />
              </svg>
            </div>
          ))}
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-2">Start building your asset library</h3>
        <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-6 leading-relaxed">
          Add virtual tours, floorplans, images, videos, and documents. Each asset can be set to Sales View, Vetted View, or both.
        </p>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 active:scale-[0.98] transition shadow-[0_1px_2px_rgba(0,0,0,0.12)]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add your first asset
        </button>
      </div>
      <div className="px-8 py-5 grid grid-cols-3 gap-6">
        {[
          { title: 'Sales View',  desc: 'Assets visible to anyone you share the guide link with.', col: 'text-sky-600' },
          { title: 'Vetted View', desc: 'Additional detail for qualified clients and confirmed partners.', col: 'text-amber-600' },
          { title: 'Both Views',  desc: 'Assets available to all recipients regardless of access level.', col: 'text-slate-500' },
        ].map(item => (
          <div key={item.title} className="text-center">
            <p className={`text-xs font-semibold mb-1 ${item.col}`}>{item.title}</p>
            <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
