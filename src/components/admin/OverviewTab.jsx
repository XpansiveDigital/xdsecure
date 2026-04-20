import { useState } from 'react'
import { getGuideStats } from '../../lib/guideUtils'

const ACCENT_COLORS = [
  { value: '#0f172a', label: 'Slate',   bg: 'bg-slate-900' },
  { value: '#1e3a5f', label: 'Navy',    bg: 'bg-blue-900'  },
  { value: '#064e3b', label: 'Forest',  bg: 'bg-emerald-900' },
  { value: '#4a1d96', label: 'Violet',  bg: 'bg-violet-900' },
  { value: '#7f1d1d', label: 'Crimson', bg: 'bg-red-900'   },
  { value: '#78350f', label: 'Bronze',  bg: 'bg-amber-900' },
]

const inputCls  = 'w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-slate-900/15 focus:border-slate-400 transition'
const labelCls  = 'block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5'
const cardCls   = 'bg-white rounded-2xl border border-zinc-200 shadow-sm'

export default function OverviewTab({ guide, setGuide, onNavigate }) {
  const [showCode, setShowCode]   = useState(false)
  const [saved,   setSaved]       = useState(false)
  const stats = getGuideStats(guide)

  function update(field, value) {
    setGuide(g => ({ ...g, [field]: value }))
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handlePublish() {
    setGuide(g => ({
      ...g,
      publishStatus: g.publishStatus === 'published' ? 'draft' : 'published',
    }))
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto px-8 py-8">

        {/* Page header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Overview</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Configure guide settings, branding, and access.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
                saved
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-white text-slate-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              {saved ? '✓ Saved' : 'Save Draft'}
            </button>
            <button
              onClick={handlePublish}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-700 transition shadow-sm"
            >
              {guide.publishStatus === 'published' ? 'Unpublish' : 'Publish Guide'}
            </button>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-3 gap-6">

          {/* ── Left column (2/3) ── */}
          <div className="col-span-2 space-y-5">

            {/* Guide Information */}
            <div className={cardCls}>
              <div className="px-6 pt-5 pb-1">
                <h2 className="text-sm font-semibold text-slate-800">Guide Information</h2>
                <p className="text-xs text-zinc-400 mt-0.5">The name, venue, and description shown in the published guide.</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Guide Name</label>
                    <input
                      className={inputCls}
                      value={guide.guideName}
                      onChange={e => update('guideName', e.target.value)}
                      placeholder="e.g. Venue Guide 2026"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Venue Name</label>
                    <input
                      className={inputCls}
                      value={guide.venueName}
                      onChange={e => update('venueName', e.target.value)}
                      placeholder="e.g. The Grand Assembly Rooms"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Short Description</label>
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={3}
                    value={guide.description}
                    onChange={e => update('description', e.target.value)}
                    placeholder="A short line shown to clients when they open the guide..."
                  />
                </div>
              </div>
            </div>

            {/* Branding */}
            <div className={cardCls}>
              <div className="px-6 pt-5 pb-1">
                <h2 className="text-sm font-semibold text-slate-800">Branding</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Logo and accent colour for the published guide.</p>
              </div>
              <div className="p-6 space-y-5">
                {/* Logo placeholder */}
                <div>
                  <label className={labelCls}>Venue Logo</label>
                  <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-300 transition cursor-pointer group">
                    <div className="w-11 h-11 rounded-xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center group-hover:shadow-md transition">
                      <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-slate-700">Upload your logo</p>
                      <p className="text-xs text-zinc-400 mt-0.5">PNG, SVG or JPG — recommended 200×60px</p>
                    </div>
                    <span className="text-xs text-zinc-400 bg-white border border-zinc-200 rounded-lg px-3 py-1.5 font-medium">
                      Choose file
                    </span>
                  </div>
                </div>
                {/* Accent colour */}
                <div>
                  <label className={labelCls}>Accent Colour</label>
                  <div className="flex items-center gap-2">
                    {ACCENT_COLORS.map(c => (
                      <button
                        key={c.value}
                        title={c.label}
                        onClick={() => update('accentColor', c.value)}
                        className={`w-8 h-8 rounded-full ${c.bg} transition ring-offset-2 ${
                          guide.accentColor === c.value
                            ? 'ring-2 ring-slate-900 scale-110'
                            : 'hover:scale-105'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-zinc-400 ml-1">{ACCENT_COLORS.find(c => c.value === guide.accentColor)?.label || 'Custom'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Access Settings */}
            <div className={cardCls}>
              <div className="px-6 pt-5 pb-1">
                <h2 className="text-sm font-semibold text-slate-800">Access Settings</h2>
                <p className="text-xs text-zinc-400 mt-0.5">The code used to unlock Vetted View assets. Share with qualified clients and partners.</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className={labelCls}>Vetted Access Code</label>
                  <div className="relative">
                    <input
                      className={inputCls}
                      type={showCode ? 'text' : 'password'}
                      value={guide.accessCode}
                      onChange={e => update('accessCode', e.target.value)}
                      placeholder="Set an access code..."
                    />
                    <button
                      type="button"
                      onClick={() => setShowCode(s => !s)}
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
                </div>
                <div>
                  <label className={labelCls}>Access Code Hint <span className="normal-case font-normal text-zinc-400">(optional)</span></label>
                  <input
                    className={inputCls}
                    value={guide.accessCodeHint}
                    onChange={e => update('accessCodeHint', e.target.value)}
                    placeholder="e.g. Contact your venue representative for access"
                  />
                  <p className="mt-1.5 text-xs text-zinc-400">Shown beneath the access code input in Vetted View.</p>
                </div>

                {/* Vetted access info */}
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    <strong className="font-semibold">Vetted access</strong> lets you share detailed layouts, operational briefings, and sensitive materials exclusively with qualified clients and partners — without making them publicly visible.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right column (1/3) ── */}
          <div className="space-y-5">

            {/* Summary stats */}
            <div className={cardCls}>
              <div className="px-5 pt-5 pb-1">
                <h2 className="text-sm font-semibold text-slate-800">Guide Summary</h2>
              </div>
              <div className="p-5 space-y-3">
                <StatRow icon="stack" label="Total Assets" value={stats.total} />
                <StatRow icon="eye" label="Sales View" value={`${stats.sales} asset${stats.sales !== 1 ? 's' : ''}`} />
                <StatRow icon="lock" label="Vetted View" value={`+${stats.vetted} additional`} amber />
                <div className="pt-2 mt-2 border-t border-zinc-100">
                  <StatRow icon="folder" label="Sections" value={`${stats.sections} categor${stats.sections !== 1 ? 'ies' : 'y'}`} />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className={cardCls}>
              <div className="p-5">
                <h2 className="text-sm font-semibold text-slate-800 mb-3">Guide Status</h2>
                <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl mb-4 ${
                  guide.publishStatus === 'published'
                    ? 'bg-emerald-50 border border-emerald-200'
                    : 'bg-zinc-50 border border-zinc-200'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    guide.publishStatus === 'published' ? 'bg-emerald-500' : 'bg-zinc-400'
                  }`} />
                  <div>
                    <p className={`text-sm font-semibold ${
                      guide.publishStatus === 'published' ? 'text-emerald-800' : 'text-slate-700'
                    }`}>
                      {guide.publishStatus === 'published' ? 'Published' : 'Draft'}
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {guide.publishStatus === 'published'
                        ? 'Guide is live and accessible'
                        : 'Not yet published'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handlePublish}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition shadow-sm ${
                    guide.publishStatus === 'published'
                      ? 'bg-white text-slate-700 border border-zinc-200 hover:bg-zinc-50'
                      : 'bg-slate-900 text-white hover:bg-slate-700'
                  }`}
                >
                  {guide.publishStatus === 'published' ? 'Unpublish' : 'Publish Guide'}
                </button>
                {guide.lastUpdated && (
                  <p className="text-center text-xs text-zinc-400 mt-3">Last updated {guide.lastUpdated}</p>
                )}
              </div>
            </div>

            {/* Quick access */}
            <div className={cardCls}>
              <div className="px-5 pt-5 pb-1">
                <h2 className="text-sm font-semibold text-slate-800">Quick Access</h2>
              </div>
              <div className="p-3 space-y-1">
                {[
                  { label: 'Manage Assets', tab: 'assets', desc: 'Add, edit, or remove assets' },
                  { label: 'Experience Builder', tab: 'builder', desc: 'Shape the guide structure' },
                  { label: 'Preview & Publish', tab: 'publish', desc: 'See what clients will see' },
                ].map(item => (
                  <button
                    key={item.tab}
                    onClick={() => onNavigate(item.tab)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-zinc-50 transition group text-left"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition">{item.label}</p>
                      <p className="text-xs text-zinc-400">{item.desc}</p>
                    </div>
                    <svg className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Stat row helper ──────────────────────────────────────────────────────────

function StatRow({ label, value, amber }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className={`text-xs font-semibold ${amber ? 'text-amber-700' : 'text-slate-800'}`}>{value}</span>
    </div>
  )
}
