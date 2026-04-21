import { useState, useRef } from 'react'
import { getGuideStats, getSections } from '../../lib/guideUtils'

// ─── Accent colour options ────────────────────────────────────────────────────

const ACCENT_COLORS = [
  { value: '#0f172a', label: 'Slate',   cls: 'bg-slate-900'   },
  { value: '#1e3a5f', label: 'Navy',    cls: 'bg-blue-900'    },
  { value: '#064e3b', label: 'Forest',  cls: 'bg-emerald-900' },
  { value: '#4a1d96', label: 'Violet',  cls: 'bg-violet-900'  },
  { value: '#7f1d1d', label: 'Crimson', cls: 'bg-red-900'     },
  { value: '#78350f', label: 'Bronze',  cls: 'bg-amber-900'   },
]

// ─── Guide health checks ──────────────────────────────────────────────────────

function getHealthChecks(guide) {
  const assets = guide.assets || []
  const checks = [
    { label: 'Guide name added',             ok: !!guide.guideName?.trim()                            },
    { label: 'Venue name added',             ok: !!guide.venueName?.trim()                            },
    { label: 'Description written',          ok: !!guide.description?.trim()                          },
    { label: 'At least one asset',           ok: assets.length > 0                                    },
    { label: 'Private access code set',      ok: !!guide.accessCode?.trim()                           },
    { label: 'All assets have sources',      ok: assets.length > 0 && assets.every(a => !!a.url?.trim()) },
  ]
  const optional = [
    { label: 'Internal access code set',     ok: !!guide.internalAccessCode?.trim(), note: 'optional' },
    { label: 'Logo uploaded',                ok: !!guide.logoUrl,                    note: 'optional' },
  ]
  const passed = checks.filter(c => c.ok).length
  return { checks, optional, passed, total: checks.length }
}

// ─── Section visibility label ─────────────────────────────────────────────────

function sectionVisLabel(assets) {
  const priv = assets.filter(a => a.visibility === 'private').length
  const int  = assets.filter(a => a.visibility === 'internal').length
  const pub  = assets.filter(a => a.visibility === 'public').length
  if (int > 0 && pub === 0 && priv === 0) return { label: 'Internal Only', cls: 'text-red-600'  }
  if (priv > 0 && pub === 0)              return { label: 'Private+',       cls: 'text-amber-600' }
  if (int > 0 || priv > 0)               return { label: 'Mixed',          cls: 'text-zinc-500'  }
  return                                         { label: 'Public',         cls: 'text-sky-600'   }
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputCls = 'w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-slate-900/15 focus:border-slate-400 transition'
const labelCls = 'block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5'
const cardCls  = 'bg-white rounded-2xl border border-zinc-200/70 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]'

// ─── OverviewTab ──────────────────────────────────────────────────────────────

export default function OverviewTab({ guide, setGuide, onNavigate }) {
  const [showPrivate,  setShowPrivate]  = useState(false)
  const [showInternal, setShowInternal] = useState(false)
  const [saved,        setSaved]        = useState(false)
  const [logoError,    setLogoError]    = useState(false)
  const fileInputRef = useRef(null)

  const stats    = getGuideStats(guide)
  const sections = getSections(guide)
  const health   = getHealthChecks(guide)
  const descLen  = (guide.description || '').length

  function update(field, value) {
    setGuide(g => ({ ...g, [field]: value }))
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleLogoUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoError(false)
    const reader = new FileReader()
    reader.onload = ev => update('logoUrl', ev.target.result)
    reader.onerror = () => setLogoError(true)
    reader.readAsDataURL(file)
    // Reset input so the same file can be re-selected if needed
    e.target.value = ''
  }

  function handleRemoveLogo() {
    update('logoUrl', null)
    setLogoError(false)
  }

  function handlePublishToggle() {
    setGuide(g => ({
      ...g,
      publishStatus: g.publishStatus === 'published' ? 'draft' : 'published',
    }))
  }

  const isPublished = guide.publishStatus === 'published'

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="max-w-5xl mx-auto px-8 py-8">

        {/* ── Page header ── */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Overview</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Name your guide, configure access, and review readiness before publishing.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition active:scale-[0.98] ${
                saved
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-white text-slate-700 border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              {saved ? '✓ Saved' : 'Save Draft'}
            </button>
            <button
              onClick={handlePublishToggle}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition active:scale-[0.98] ${
                isPublished
                  ? 'bg-white text-slate-700 border border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-zinc-50'
                  : 'bg-slate-900 text-white shadow-[0_1px_2px_rgba(0,0,0,0.12)] hover:bg-slate-800'
              }`}
            >
              {isPublished ? 'Unpublish' : 'Publish Guide'}
            </button>
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-3 gap-6">

          {/* ── Left (2/3) ── */}
          <div className="col-span-2 space-y-5">

            {/* Guide Information */}
            <div className={cardCls}>
              <div className="px-6 pt-5 pb-2">
                <h2 className="text-sm font-semibold text-slate-800">Guide Information</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Shown to clients when they open the published guide.</p>
              </div>
              <div className="px-6 pb-6 space-y-4">
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
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={labelCls} style={{ marginBottom: 0 }}>Short Description</label>
                    <span className={`text-[11px] font-medium tabular-nums ${descLen > 180 ? 'text-amber-600' : 'text-zinc-400'}`}>
                      {descLen}/200
                    </span>
                  </div>
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={3}
                    maxLength={200}
                    value={guide.description}
                    onChange={e => update('description', e.target.value)}
                    placeholder="A short line shown to clients when they open the guide — keep it concise and clear."
                  />
                </div>
              </div>
            </div>

            {/* Branding */}
            <div className={cardCls}>
              <div className="px-6 pt-5 pb-2">
                <h2 className="text-sm font-semibold text-slate-800">Branding</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Customise how the guide looks when shared with clients.</p>
              </div>
              <div className="px-6 pb-6 space-y-5">
                <div>
                  <label className={labelCls}>Venue Logo</label>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />

                  {guide.logoUrl ? (
                    /* ── Logo preview ── */
                    <div className="border border-zinc-200 rounded-2xl p-5 bg-zinc-50 flex items-center gap-4">
                      <div className="h-12 flex items-center justify-center bg-white border border-zinc-200 rounded-xl px-4 shadow-sm shrink-0">
                        <img
                          src={guide.logoUrl}
                          alt="Venue logo"
                          className="h-8 max-w-[140px] object-contain"
                          onError={() => setLogoError(true)}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700">Logo uploaded</p>
                        <p className="text-xs text-zinc-400 mt-0.5">Shown in the guide header.</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs text-zinc-500 bg-white border border-zinc-200 rounded-lg px-3 py-1.5 font-medium hover:border-zinc-300 hover:bg-zinc-50 transition"
                        >
                          Replace
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="text-xs text-red-500 bg-white border border-red-100 rounded-lg px-3 py-1.5 font-medium hover:bg-red-50 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── Upload area ── */
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-zinc-200 rounded-2xl p-7 flex items-center gap-5 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-300 transition group text-left"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center shrink-0 group-hover:shadow-md transition">
                        <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-700">Upload your venue logo</p>
                        <p className="text-xs text-zinc-400 mt-0.5">PNG, SVG, JPG or WebP · 200×60px recommended · Max 2MB</p>
                      </div>
                      <span className="text-xs text-zinc-500 bg-white border border-zinc-200 rounded-lg px-3 py-1.5 font-medium shrink-0 group-hover:border-zinc-300">
                        Choose file
                      </span>
                    </button>
                  )}

                  {logoError && (
                    <p className="mt-1.5 text-xs text-red-500">Couldn't load that image — try a different file.</p>
                  )}
                </div>
                <div>
                  <label className={labelCls}>Accent Colour</label>
                  <div className="flex items-center gap-2.5">
                    {ACCENT_COLORS.map(c => (
                      <button
                        key={c.value}
                        title={c.label}
                        onClick={() => update('accentColor', c.value)}
                        className={`w-7 h-7 rounded-full ${c.cls} ring-offset-2 transition ${
                          guide.accentColor === c.value
                            ? 'ring-2 ring-slate-700 scale-110'
                            : 'hover:scale-105 opacity-70 hover:opacity-100'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-zinc-400 ml-1">
                      {ACCENT_COLORS.find(c => c.value === guide.accentColor)?.label ?? 'Custom'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Access Settings */}
            <div className={cardCls}>
              <div className="px-6 pt-5 pb-2">
                <h2 className="text-sm font-semibold text-slate-800">Access Settings</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Configure access codes for Private and Internal layers. Share each code only with the intended audience.
                </p>
              </div>
              <div className="px-6 pb-6 space-y-5">

                {/* Private Access */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Private
                    </span>
                    <span className="text-xs text-zinc-400">Qualified clients and approved contacts</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Access Code</label>
                      <div className="relative">
                        <input
                          className={`${inputCls} pr-10`}
                          type={showPrivate ? 'text' : 'password'}
                          value={guide.accessCode}
                          onChange={e => update('accessCode', e.target.value)}
                          placeholder="Set a code..."
                        />
                        <button type="button" onClick={() => setShowPrivate(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-slate-600 transition">
                          <EyeIcon show={showPrivate} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Code Hint <span className="normal-case font-normal text-zinc-400">(optional)</span></label>
                      <input
                        className={inputCls}
                        value={guide.accessCodeHint}
                        onChange={e => update('accessCodeHint', e.target.value)}
                        placeholder="e.g. Contact your event manager"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-100" />

                {/* Internal Access */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 rounded-full px-2.5 py-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      Internal
                    </span>
                    <span className="text-xs text-zinc-400">Authorised team members only</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Internal Code</label>
                      <div className="relative">
                        <input
                          className={`${inputCls} pr-10`}
                          type={showInternal ? 'text' : 'password'}
                          value={guide.internalAccessCode || ''}
                          onChange={e => update('internalAccessCode', e.target.value)}
                          placeholder="Set a code..."
                        />
                        <button type="button" onClick={() => setShowInternal(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-slate-600 transition">
                          <EyeIcon show={showInternal} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Code Hint <span className="normal-case font-normal text-zinc-400">(optional)</span></label>
                      <input
                        className={inputCls}
                        value={guide.internalAccessCodeHint || ''}
                        onChange={e => update('internalAccessCodeHint', e.target.value)}
                        placeholder="e.g. Team access only"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-zinc-50 border border-zinc-200/70 rounded-xl px-4 py-3">
                  <svg className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Each layer has a separate, shareable URL. Share <strong className="font-medium text-slate-700">/private</strong> with qualified clients and <strong className="font-medium text-slate-700">/internal</strong> only with your team.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* ── Right (1/3) ── */}
          <div className="space-y-5">

            {/* Guide Health */}
            <div className={cardCls}>
              <div className="px-5 pt-5 pb-3">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-slate-800">Guide Health</h2>
                  <span className={`text-xs font-bold ${
                    health.passed === health.total ? 'text-emerald-600' : 'text-zinc-500'
                  }`}>
                    {health.passed}/{health.total}
                  </span>
                </div>
                <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden mb-4">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      health.passed === health.total ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}
                    style={{ width: `${(health.passed / health.total) * 100}%` }}
                  />
                </div>
                <div className="space-y-2">
                  {health.checks.map(c => (
                    <div key={c.label} className="flex items-center gap-2.5">
                      <CheckDot ok={c.ok} />
                      <span className={`text-xs ${c.ok ? 'text-slate-600' : 'text-zinc-400'}`}>{c.label}</span>
                    </div>
                  ))}
                  {health.optional.map(c => (
                    <div key={c.label} className="flex items-center gap-2.5 opacity-60">
                      <CheckDot ok={c.ok} />
                      <span className="text-xs text-zinc-400">{c.label} <span className="text-zinc-300">· optional</span></span>
                    </div>
                  ))}
                </div>
                {health.passed === health.total && (
                  <div className="mt-3 pt-3 border-t border-zinc-100 text-center">
                    <p className="text-xs font-semibold text-emerald-700">All set — ready to publish</p>
                  </div>
                )}
              </div>
            </div>

            {/* Publish Status */}
            <div className={cardCls}>
              <div className="p-5">
                <h2 className="text-sm font-semibold text-slate-800 mb-3">Publish Status</h2>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-4 ${
                  isPublished
                    ? 'bg-emerald-50 border border-emerald-200'
                    : 'bg-zinc-50 border border-zinc-200'
                }`}>
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isPublished ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold leading-none ${isPublished ? 'text-emerald-800' : 'text-slate-600'}`}>
                      {isPublished ? 'Published' : 'Draft'}
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-none">
                      {isPublished ? 'Live and accessible to recipients' : 'Not yet shared with anyone'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handlePublishToggle}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition active:scale-[0.99] ${
                    isPublished
                      ? 'bg-white text-slate-600 border border-zinc-200 hover:bg-zinc-50'
                      : health.passed < health.total
                        ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200'
                        : 'bg-slate-900 text-white shadow-[0_1px_2px_rgba(0,0,0,0.12)] hover:bg-slate-800'
                  }`}
                  title={!isPublished && health.passed < health.total ? 'Complete the guide health checklist first' : undefined}
                >
                  {isPublished ? 'Unpublish Guide' : 'Publish Guide'}
                </button>
                {!isPublished && health.passed < health.total && (
                  <p className="text-center text-[11px] text-zinc-400 mt-2">
                    {health.total - health.passed} item{health.total - health.passed !== 1 ? 's' : ''} still needed above
                  </p>
                )}
              </div>
            </div>

            {/* Sections Summary */}
            <div className={cardCls}>
              <div className="px-5 pt-5 pb-3">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-slate-800">Sections</h2>
                  <button onClick={() => onNavigate('builder')} className="text-xs text-zinc-400 hover:text-slate-600 transition">
                    Edit →
                  </button>
                </div>
                {sections.length === 0 ? (
                  <p className="text-xs text-zinc-400 italic py-2">No sections yet — add assets to build your guide.</p>
                ) : (
                  <div className="space-y-2">
                    {sections.map(s => {
                      const vis = sectionVisLabel(s.assets)
                      return (
                        <div key={s.category} className="flex items-center justify-between py-1.5 border-b border-zinc-50 last:border-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-1 h-4 rounded-full bg-zinc-200 shrink-0" />
                            <span className="text-xs font-medium text-slate-700 truncate">{s.category}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-[10px] font-semibold ${vis.cls}`}>{vis.label}</span>
                            <span className="text-[10px] text-zinc-400 tabular-nums">{s.assets.length}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
                <button
                  onClick={() => onNavigate('assets')}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-zinc-500 hover:text-slate-700 hover:bg-zinc-50 border border-dashed border-zinc-200 transition"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add assets
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CheckDot({ ok }) {
  return (
    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${ok ? 'bg-emerald-100' : 'bg-zinc-100'}`}>
      {ok
        ? <svg className="w-2.5 h-2.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
        : <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
      }
    </div>
  )
}

function EyeIcon({ show }) {
  return show ? (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
