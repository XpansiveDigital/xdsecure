import { useState, useEffect } from 'react'
import { ASSET_TYPES, ASSET_CATEGORIES, VISIBILITY_OPTIONS } from '../../data/demoVenue'
import { TYPE_CONFIG } from '../../lib/guideUtils'

const emptyAsset = {
  name:        '',
  type:        'embed',
  url:         '',
  description: '',
  category:    'Main Tour',
  visibility:  'both',
  status:      'ready',
  featured:    false,
}

const URL_PLACEHOLDERS = {
  embed: 'https://my.matterport.com/show/?m=...',
  pdf:   'https://example.com/floorplan.pdf',
  image: 'https://images.unsplash.com/...',
  video: 'https://www.youtube.com/embed/...',
  link:  'https://example.com',
}

const URL_HINTS = {
  embed: 'Use the full Matterport share URL or any embeddable 3D tour link.',
  pdf:   'Paste a direct link to the PDF. Google Drive and Dropbox links are supported.',
  image: 'Paste a direct image URL. Unsplash and Cloudinary URLs work well.',
  video: 'Use a YouTube or Vimeo embed URL — e.g. youtube.com/embed/...',
  link:  'Any external URL that should open in a new tab.',
}

const inputCls = 'w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-slate-900/15 focus:border-slate-400 transition'
const labelCls = 'block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5'

const VIS_STYLES = {
  both:   { active: 'border-slate-800 bg-slate-50 ring-1 ring-slate-300',   label: 'text-slate-800' },
  sales:  { active: 'border-sky-400   bg-sky-50   ring-1 ring-sky-300',     label: 'text-sky-800'   },
  vetted: { active: 'border-amber-400 bg-amber-50 ring-1 ring-amber-300',   label: 'text-amber-800' },
}

export default function AssetEditorModal({ asset, prefillCategory, onSave, onCancel }) {
  const [form, setForm] = useState(emptyAsset)

  useEffect(() => {
    if (asset) {
      setForm({ ...emptyAsset, ...asset })
    } else {
      setForm({ ...emptyAsset, category: prefillCategory || emptyAsset.category })
    }
  }, [asset, prefillCategory])

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    onSave(form)
  }

  const tc = TYPE_CONFIG[form.type] || TYPE_CONFIG.link

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tc.bg}`}>
              <svg className={`w-4 h-4 ${tc.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d={tc.iconPath} />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                {asset ? 'Edit Asset' : 'Add Asset'}
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {asset ? 'Update details and settings.' : 'Add a new asset to the guide.'}
              </p>
            </div>
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
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

          {/* Asset name */}
          <div>
            <label className={labelCls}>Asset Name <span className="text-red-400 normal-case">*</span></label>
            <input
              className={inputCls}
              placeholder="e.g. Main Venue Tour"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              autoFocus
              required
            />
          </div>

          {/* Type + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Asset Type</label>
              <select
                className={inputCls}
                value={form.type}
                onChange={e => set('type', e.target.value)}
              >
                {ASSET_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select
                className={inputCls}
                value={form.category}
                onChange={e => set('category', e.target.value)}
              >
                {ASSET_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* URL / Source */}
          <div>
            <label className={labelCls}>Source URL</label>
            <input
              className={inputCls}
              placeholder={URL_PLACEHOLDERS[form.type] || 'https://...'}
              value={form.url}
              onChange={e => set('url', e.target.value)}
            />
            <p className="mt-1.5 text-xs text-zinc-400">{URL_HINTS[form.type]}</p>

            {/* Image preview */}
            {form.type === 'image' && form.url && (
              <div className="mt-2 rounded-xl overflow-hidden border border-zinc-200 h-28 bg-zinc-50">
                <img
                  src={form.url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={e => { e.target.style.display = 'none' }}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description <span className="normal-case font-normal text-zinc-400">(optional)</span></label>
            <textarea
              className={`${inputCls} resize-none`}
              rows={3}
              placeholder="A brief note shown to clients when this asset is selected..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          {/* Visibility */}
          <div>
            <label className={labelCls}>Visibility</label>
            <div className="grid grid-cols-3 gap-2">
              {VISIBILITY_OPTIONS.map(opt => {
                const st = VIS_STYLES[opt.value] || VIS_STYLES.both
                const active = form.visibility === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set('visibility', opt.value)}
                    className={`flex flex-col gap-0.5 rounded-xl border px-3 py-3 text-left transition ${
                      active ? st.active : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <span className={`text-xs font-semibold ${active ? st.label : 'text-slate-700'}`}>
                      {opt.label}
                    </span>
                    <span className="text-[11px] text-zinc-400 leading-tight">{opt.description}</span>
                  </button>
                )
              })}
            </div>
            {form.visibility === 'vetted' && (
              <div className="mt-2 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                <svg className="w-3.5 h-3.5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <p className="text-xs text-amber-800">Only visible to users with the Vetted View access code.</p>
              </div>
            )}
          </div>

          {/* Status + Featured row */}
          <div className="flex items-center gap-4 pt-1">
            <div className="flex-1">
              <label className={labelCls}>Status</label>
              <div className="flex gap-2">
                {['ready', 'draft'].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => set('status', s)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition ${
                      form.status === s
                        ? s === 'ready'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-zinc-100 text-slate-600 border-zinc-300'
                        : 'bg-white text-zinc-400 border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    {s === 'ready' ? 'Ready' : 'Draft'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelCls}>Featured</label>
              <button
                type="button"
                onClick={() => set('featured', !form.featured)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition ${
                  form.featured
                    ? 'bg-amber-50 text-amber-700 border-amber-300'
                    : 'bg-white text-zinc-400 border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <svg
                  className={`w-3.5 h-3.5 ${form.featured ? 'fill-amber-500 text-amber-500' : 'fill-none text-zinc-400'}`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.75}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                {form.featured ? 'Featured' : 'Feature this'}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-zinc-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-700 transition shadow-sm"
            >
              {asset ? 'Save Changes' : 'Add Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
