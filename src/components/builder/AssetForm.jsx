import { useState, useEffect } from 'react'
import { ASSET_TYPES, ASSET_CATEGORIES, VISIBILITY_OPTIONS } from '../../data/demoVenue'

// AssetForm: modal dialog for adding or editing a single asset.
// Props:
//   asset     — existing asset to edit, or null for a new asset
//   onSave    — called with the final asset object
//   onCancel  — called when the user dismisses without saving

const emptyAsset = {
  name: '',
  type: 'embed',
  url: '',
  description: '',
  category: 'Main Tour',
  visibility: 'both',
}

export default function AssetForm({ asset, onSave, onCancel }) {
  const [form, setForm] = useState(emptyAsset)

  useEffect(() => {
    setForm(asset ? { ...asset } : { ...emptyAsset })
  }, [asset])

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    onSave(form)
  }

  const inputClass =
    'w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 transition'

  const labelClass = 'block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide'

  // Colours per visibility option
  const visStyles = {
    both:   { active: 'border-slate-800 bg-slate-50 ring-1 ring-slate-800', label: 'text-slate-800' },
    sales:  { active: 'border-slate-400 bg-zinc-50 ring-1 ring-slate-400',  label: 'text-slate-700' },
    vetted: { active: 'border-amber-400 bg-amber-50 ring-1 ring-amber-400', label: 'text-amber-700' },
  }

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              {asset ? 'Edit Asset' : 'Add Asset'}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {asset ? 'Update this asset\'s details and visibility.' : 'Add a new asset to the guide.'}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-slate-700 hover:bg-zinc-100 transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* Name */}
          <div>
            <label className={labelClass}>Asset Name *</label>
            <input
              className={inputClass}
              placeholder="e.g. Main Venue Tour"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              required
            />
          </div>

          {/* Type + Category row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Type</label>
              <select
                className={inputClass}
                value={form.type}
                onChange={(e) => set('type', e.target.value)}
              >
                {ASSET_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select
                className={inputClass}
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
              >
                {ASSET_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* URL */}
          <div>
            <label className={labelClass}>URL or Link</label>
            <input
              className={inputClass}
              placeholder="https://..."
              value={form.url}
              onChange={(e) => set('url', e.target.value)}
            />
            <p className="mt-1.5 text-xs text-zinc-400">
              For embeds, use the direct share or embed URL. For PDFs, paste a direct link.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description (optional)</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={3}
              placeholder="A brief line shown to users when this asset is selected..."
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>

          {/* Visibility */}
          <div>
            <label className={labelClass}>Visibility</label>
            <div className="grid grid-cols-3 gap-2">
              {VISIBILITY_OPTIONS.map((opt) => {
                const styles = visStyles[opt.value] || visStyles.both
                const isSelected = form.visibility === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set('visibility', opt.value)}
                    className={`flex flex-col items-start gap-0.5 rounded-xl border px-3 py-3 text-left transition ${
                      isSelected ? styles.active : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <span className={`text-xs font-semibold ${isSelected ? styles.label : 'text-slate-700'}`}>
                      {opt.label}
                    </span>
                    <span className="text-[11px] text-zinc-400 leading-tight">{opt.description}</span>
                  </button>
                )
              })}
            </div>
            {form.visibility === 'vetted' && (
              <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                This asset will only be visible to users with the Enhanced View access code.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-zinc-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-900 text-white hover:bg-slate-700 transition shadow-sm"
            >
              {asset ? 'Save Changes' : 'Add Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
