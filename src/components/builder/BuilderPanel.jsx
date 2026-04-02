import { useState } from 'react'
import AssetList from './AssetList'
import AssetForm from './AssetForm'

// BuilderPanel: admin area for configuring the guide and its assets.
// TODO: On save, POST guide data to backend API (e.g. PUT /api/guides/:id).

let nextId = 100 // Simple ID counter for new assets (replace with backend-generated IDs)

export default function BuilderPanel({ guide, setGuide }) {
  const [showForm, setShowForm] = useState(false)
  const [editingAsset, setEditingAsset] = useState(null)
  const [showCode, setShowCode] = useState(false)

  function updateField(field, value) {
    setGuide((g) => ({ ...g, [field]: value }))
  }

  function handleAddAsset() {
    setEditingAsset(null)
    setShowForm(true)
  }

  function handleEditAsset(asset) {
    setEditingAsset(asset)
    setShowForm(true)
  }

  function handleSaveAsset(formData) {
    if (editingAsset) {
      setGuide((g) => ({
        ...g,
        assets: g.assets.map((a) => (a.id === editingAsset.id ? { ...formData, id: a.id } : a)),
      }))
    } else {
      const newAsset = { ...formData, id: String(nextId++) }
      setGuide((g) => ({ ...g, assets: [...g.assets, newAsset] }))
    }
    setShowForm(false)
    setEditingAsset(null)
  }

  function handleDeleteAsset(id) {
    setGuide((g) => ({ ...g, assets: g.assets.filter((a) => a.id !== id) }))
  }

  function handleMoveAsset(index, direction) {
    const assets = [...guide.assets]
    const target = index + direction
    if (target < 0 || target >= assets.length) return
    ;[assets[index], assets[target]] = [assets[target], assets[index]]
    setGuide((g) => ({ ...g, assets }))
  }

  const inputClass =
    'w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 transition'
  const labelClass = 'block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide'

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto scrollbar-thin bg-zinc-50">
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Guide Builder</h1>
          <p className="text-sm text-zinc-500 mt-1.5 leading-relaxed">
            Configure your guide and manage what's shared, with who, and how it's presented.
            All changes appear immediately in the Published Guide.
          </p>
        </div>

        {/* Guide Settings Card */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 mb-5">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-slate-800">Guide Settings</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Name, description, and access configuration.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Guide Name</label>
              <input
                className={inputClass}
                value={guide.guideName}
                onChange={(e) => updateField('guideName', e.target.value)}
                placeholder="e.g. Venue Guide 2024"
              />
            </div>
            <div>
              <label className={labelClass}>Venue Name</label>
              <input
                className={inputClass}
                value={guide.venueName}
                onChange={(e) => updateField('venueName', e.target.value)}
                placeholder="e.g. The Grand Assembly Rooms"
              />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Guide Description</label>
              <textarea
                className={`${inputClass} resize-none`}
                rows={2}
                value={guide.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="A short line shown beneath the venue name in the Published Guide..."
              />
            </div>

            {/* Access code */}
            <div>
              <label className={labelClass}>Enhanced View — Access Code</label>
              <div className="relative">
                <input
                  className={inputClass}
                  type={showCode ? 'text' : 'password'}
                  value={guide.accessCode}
                  onChange={(e) => updateField('accessCode', e.target.value)}
                  placeholder="Set an access code"
                />
                <button
                  type="button"
                  onClick={() => setShowCode((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-slate-600 transition"
                >
                  {showCode ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {/* TODO: Hash before persisting to backend. Replace with token-based session. */}
              <p className="mt-1.5 text-xs text-zinc-400">
                Share this code with qualified clients or partners to grant access to vetted assets.
              </p>
            </div>
          </div>
        </div>

        {/* Vetted access info strip */}
        <div className="flex items-start gap-3 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 mb-5">
          <svg className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <p className="text-xs text-stone-600 leading-relaxed">
            <strong className="font-semibold text-stone-700">Vetted access</strong> lets you share additional
            detail — layouts, operational plans, and briefing materials — with qualified clients and partners,
            without making it publicly available.
          </p>
        </div>

        {/* Assets Card */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Assets</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {guide.assets.length} asset{guide.assets.length !== 1 ? 's' : ''} configured
              </p>
            </div>
            <button
              onClick={handleAddAsset}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Asset
            </button>
          </div>

          <AssetList
            assets={guide.assets}
            onEdit={handleEditAsset}
            onDelete={handleDeleteAsset}
            onMove={handleMoveAsset}
          />
        </div>

      </div>

      {/* Asset form modal */}
      {showForm && (
        <AssetForm
          asset={editingAsset}
          onSave={handleSaveAsset}
          onCancel={() => { setShowForm(false); setEditingAsset(null) }}
        />
      )}
    </div>
  )
}
