import { useState } from 'react'
import AssetEditorModal from './AssetEditorModal'
import { TYPE_CONFIG, VISIBILITY_CONFIG, nextAssetId } from '../../lib/guideUtils'
import { getSectionOrder } from '../../lib/guideUtils'

// ─── Filter chips ─────────────────────────────────────────────────────────────

const TYPE_FILTERS = [
  { value: '',      label: 'All Types' },
  { value: 'embed', label: 'Virtual Tour' },
  { value: 'pdf',   label: 'PDF' },
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
  { value: 'link',  label: 'Link' },
]

const VIS_FILTERS = [
  { value: '',       label: 'All Visibility' },
  { value: 'both',   label: 'Sales + Vetted' },
  { value: 'sales',  label: 'Sales Only' },
  { value: 'vetted', label: 'Vetted Only' },
]

// ─── AssetsTab ────────────────────────────────────────────────────────────────

export default function AssetsTab({ guide, setGuide }) {
  const [showModal,     setShowModal]     = useState(false)
  const [editingAsset,  setEditingAsset]  = useState(null)
  const [search,        setSearch]        = useState('')
  const [typeFilter,    setTypeFilter]    = useState('')
  const [visFilter,     setVisFilter]     = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)

  // ── mutations ──

  function handleAdd() {
    setEditingAsset(null)
    setShowModal(true)
  }

  function handleEdit(asset) {
    setEditingAsset(asset)
    setShowModal(true)
  }

  function handleSave(formData) {
    if (editingAsset) {
      setGuide(g => ({
        ...g,
        assets: g.assets.map(a => a.id === editingAsset.id ? { ...formData, id: a.id } : a),
      }))
    } else {
      const id       = nextAssetId()
      const newAsset = { ...formData, id }
      setGuide(g => {
        const newSectionOrder = g.sectionOrder?.includes(formData.category)
          ? g.sectionOrder
          : [...(g.sectionOrder || getSectionOrder(g)), formData.category]
        return { ...g, assets: [...g.assets, newAsset], sectionOrder: newSectionOrder }
      })
    }
    setShowModal(false)
    setEditingAsset(null)
  }

  function handleDelete(id) {
    setGuide(g => {
      const newAssets = g.assets.filter(a => a.id !== id)
      const remaining = new Set(newAssets.map(a => a.category))
      const newOrder  = (g.sectionOrder || []).filter(cat => remaining.has(cat))
      return { ...g, assets: newAssets, sectionOrder: newOrder }
    })
    setConfirmDelete(null)
  }

  function handleMove(index, direction) {
    const assets = [...guide.assets]
    const target = index + direction
    if (target < 0 || target >= assets.length) return
    ;[assets[index], assets[target]] = [assets[target], assets[index]]
    setGuide(g => ({ ...g, assets }))
  }

  // ── filtering ──

  const filtered = guide.assets.filter(a => {
    const matchType   = !typeFilter || a.type === typeFilter
    const matchVis    = !visFilter  || a.visibility === visFilter
    const matchSearch = !search     || a.name.toLowerCase().includes(search.toLowerCase()) ||
                        (a.description || '').toLowerCase().includes(search.toLowerCase()) ||
                        (a.category    || '').toLowerCase().includes(search.toLowerCase())
    return matchType && matchVis && matchSearch
  })

  // ── stats ──
  const salesCount  = guide.assets.filter(a => a.visibility === 'both' || a.visibility === 'sales').length
  const vettedCount = guide.assets.filter(a => a.visibility === 'vetted').length

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto px-8 py-8">

        {/* Page header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Assets</h1>
            <p className="text-sm text-zinc-500 mt-1">
              {guide.assets.length} asset{guide.assets.length !== 1 ? 's' : ''}
              {' · '}
              <span className="text-sky-600">{salesCount} Sales</span>
              {' · '}
              <span className="text-amber-600">{vettedCount} Vetted</span>
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Asset
          </button>
        </div>

        {/* Filter bar */}
        <div className="bg-white border border-zinc-200 rounded-2xl px-4 py-3 mb-5 flex items-center gap-3 flex-wrap shadow-sm">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-zinc-200 rounded-lg placeholder-zinc-400 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/15 focus:border-slate-400 transition"
              placeholder="Search assets..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {/* Type filter */}
          <div className="flex items-center gap-1">
            {TYPE_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setTypeFilter(f.value)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  typeFilter === f.value
                    ? 'bg-slate-900 text-white'
                    : 'text-zinc-500 hover:text-slate-700 hover:bg-zinc-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          {/* Divider */}
          <div className="w-px h-4 bg-zinc-200" />
          {/* Visibility filter */}
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
        </div>

        {/* Asset list */}
        {filtered.length === 0 ? (
          <EmptyState hasAssets={guide.assets.length > 0} onAdd={handleAdd} />
        ) : (
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
            {filtered.map((asset, idx) => {
              const globalIdx = guide.assets.findIndex(a => a.id === asset.id)
              const tc = TYPE_CONFIG[asset.type] || TYPE_CONFIG.link
              const vc = VISIBILITY_CONFIG[asset.visibility] || VISIBILITY_CONFIG.both
              const isFirst = globalIdx === 0
              const isLast  = globalIdx === guide.assets.length - 1
              return (
                <div
                  key={asset.id}
                  className={`flex items-center gap-4 px-5 py-4 group hover:bg-zinc-50 transition-colors ${
                    idx > 0 ? 'border-t border-zinc-100' : ''
                  }`}
                >
                  {/* Type icon */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tc.bg}`}>
                    <svg className={`w-4.5 h-4.5 ${tc.text}`} style={{width:'18px',height:'18px'}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={tc.iconPath} />
                    </svg>
                  </div>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-800 truncate">{asset.name}</span>
                      {asset.featured && (
                        <svg className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                      )}
                      <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-md ${tc.bg} ${tc.text}`}>{tc.abbr}</span>
                      <span className="text-[11px] text-zinc-400">{asset.category}</span>
                    </div>
                    {asset.description && (
                      <p className="text-xs text-zinc-400 mt-0.5 truncate">{asset.description}</p>
                    )}
                  </div>

                  {/* Visibility badge */}
                  <span className={`text-[11px] font-semibold rounded-full px-2.5 py-1 shrink-0 ${vc.pill}`}>
                    {vc.short}
                  </span>

                  {/* Status */}
                  <span className={`text-[11px] font-semibold rounded-full px-2.5 py-1 shrink-0 ${
                    asset.status === 'ready'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                  }`}>
                    {asset.status === 'ready' ? 'Ready' : 'Draft'}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-0.5 shrink-0">
                    {/* Move up/down */}
                    <button
                      onClick={() => handleMove(globalIdx, -1)}
                      disabled={isFirst}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-300 hover:text-slate-600 hover:bg-zinc-100 disabled:opacity-20 disabled:cursor-not-allowed transition"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleMove(globalIdx, 1)}
                      disabled={isLast}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-300 hover:text-slate-600 hover:bg-zinc-100 disabled:opacity-20 disabled:cursor-not-allowed transition"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                    {/* Edit */}
                    <button
                      onClick={() => handleEdit(asset)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-300 hover:text-slate-700 hover:bg-zinc-100 transition"
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
                        >Delete</button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="px-2 py-1 rounded-lg text-[11px] font-medium text-zinc-500 hover:bg-zinc-100 transition"
                        >Cancel</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(asset.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-300 hover:text-red-500 hover:bg-red-50 transition"
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
          </div>
        )}

      </div>

      {/* Modal */}
      {showModal && (
        <AssetEditorModal
          asset={editingAsset}
          onSave={handleSave}
          onCancel={() => { setShowModal(false); setEditingAsset(null) }}
        />
      )}
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ hasAssets, onAdd }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm py-16 flex flex-col items-center gap-4 text-center">
      <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center">
        <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700">
          {hasAssets ? 'No assets match your filters' : 'No assets yet'}
        </p>
        <p className="text-xs text-zinc-400 mt-1">
          {hasAssets ? 'Try adjusting the filters above.' : 'Add your first asset to get started.'}
        </p>
      </div>
      {!hasAssets && (
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Asset
        </button>
      )}
    </div>
  )
}
