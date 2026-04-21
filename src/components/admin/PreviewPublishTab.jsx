import { useState } from 'react'
import ViewerPanel from '../viewer/ViewerPanel'
import { getGuideStats, getSections } from '../../lib/guideUtils'

// ─── Pre-publish checks ───────────────────────────────────────────────────────

function getPublishChecks(guide) {
  const assets = guide.assets || []
  return [
    { label: 'Guide name set',          ok: !!guide.guideName?.trim()                            },
    { label: 'Venue name set',          ok: !!guide.venueName?.trim()                            },
    { label: 'Assets configured',       ok: assets.length > 0                                    },
    { label: 'All assets have sources', ok: assets.length > 0 && assets.every(a => !!a.url?.trim()) },
    { label: 'Private access code set', ok: !!guide.accessCode?.trim()                           },
  ]
}

// ─── Share link row ───────────────────────────────────────────────────────────

function ShareLinkRow({ label, hint, url, copyKey, copied, onCopy, colorCls, iconPath, lockIcon }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <p className="text-[11px] font-semibold text-slate-600">{label}</p>
        {lockIcon && (
          <svg className={`w-2.5 h-2.5 ${colorCls}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        )}
      </div>
      <div className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 ${
        url ? `bg-zinc-50 border-zinc-200` : 'bg-zinc-50 border-zinc-100 opacity-50'
      }`}>
        <svg className={`w-3 h-3 shrink-0 ${url ? colorCls : 'text-zinc-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
        </svg>
        <span className="flex-1 text-[11px] text-slate-500 truncate font-mono">
          {url || hint}
        </span>
        {url && (
          <button
            onClick={() => onCopy(url, copyKey)}
            className="shrink-0 text-[10px] font-semibold text-zinc-400 hover:text-slate-600 transition"
          >
            {copied === copyKey ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── PreviewPublishTab ────────────────────────────────────────────────────────

const LINK_ICON = "M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
const LOCK_ICON = "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"

export default function PreviewPublishTab({ guide, setGuide }) {
  const [copied, setCopied] = useState(null)

  const stats    = getGuideStats(guide)
  const sections = getSections(guide)
  const checks   = getPublishChecks(guide)
  const allPassed   = checks.every(c => c.ok)
  const isPublished = guide.publishStatus === 'published'

  // Share links — only available when published
  const base         = isPublished ? 'venueguide.io/grand-assembly' : null
  const publicLink   = base ? `${base}/public`   : null
  const privateLink  = base ? `${base}/private`  : null
  const internalLink = base ? `${base}/internal` : null

  function handlePublishToggle() {
    setGuide(g => ({
      ...g,
      publishStatus: g.publishStatus === 'published' ? 'draft' : 'published',
    }))
  }

  function handleCopy(text, key) {
    navigator.clipboard?.writeText('https://' + text).catch(() => {})
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="h-full flex overflow-hidden">

      {/* ── Left sidebar: Publish controls ── */}
      <div className="w-72 shrink-0 border-r border-zinc-200/80 bg-white overflow-y-auto flex flex-col scrollbar-thin">

        {/* Header */}
        <div className="px-5 py-5 border-b border-zinc-100">
          <h2 className="text-sm font-bold text-slate-800">Publish Settings</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Control publication and sharing for this guide.</p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

          {/* Status + publish button */}
          <div>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-3 ${
              isPublished
                ? 'bg-emerald-50 border border-emerald-200'
                : 'bg-zinc-50 border border-zinc-200'
            }`}>
              <div className={`w-2 h-2 rounded-full shrink-0 ${isPublished ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
              <div>
                <p className={`text-sm font-semibold ${isPublished ? 'text-emerald-800' : 'text-slate-600'}`}>
                  {isPublished ? 'Published' : 'Draft'}
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  {isPublished ? 'Live — accessible to recipients' : 'Not yet shared'}
                </p>
              </div>
            </div>

            <button
              onClick={handlePublishToggle}
              disabled={!isPublished && !allPassed}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold transition active:scale-[0.99] ${
                isPublished
                  ? 'bg-white border border-zinc-200 text-slate-700 hover:bg-zinc-50'
                  : allPassed
                    ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-[0_1px_2px_rgba(0,0,0,0.12)]'
                    : 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200'
              }`}
            >
              {isPublished ? 'Unpublish Guide' : 'Publish Guide'}
            </button>
            {!isPublished && !allPassed && (
              <p className="text-[11px] text-center text-zinc-400 mt-2">
                Complete the readiness checklist first
              </p>
            )}
          </div>

          {/* Share links — 3 layers */}
          <div>
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-3">Share Links</p>
            <div className="space-y-2.5">

              {/* Public */}
              <ShareLinkRow
                label="Public View"
                hint="Available when published"
                url={publicLink}
                copyKey="public"
                copied={copied}
                onCopy={handleCopy}
                colorCls="text-sky-500"
                iconPath={LINK_ICON}
              />

              {/* Private */}
              <ShareLinkRow
                label="Private Access"
                hint="Available when published"
                url={privateLink}
                copyKey="private"
                copied={copied}
                onCopy={handleCopy}
                colorCls="text-amber-500"
                iconPath={LOCK_ICON}
                lockIcon
              />

              {/* Internal */}
              <ShareLinkRow
                label="Internal Use Only"
                hint="Available when published"
                url={internalLink}
                copyKey="internal"
                copied={copied}
                onCopy={handleCopy}
                colorCls="text-red-500"
                iconPath={LOCK_ICON}
                lockIcon
              />

            </div>

            {isPublished && (
              <p className="mt-2.5 text-[10px] text-zinc-400 leading-relaxed">
                Private and Internal links require an access code to unlock.
              </p>
            )}
          </div>

          {/* Guide summary */}
          <div>
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-3">Guide Summary</p>
            <div className="space-y-2">
              <SummaryRow label="Public assets"   value={stats.public}   cls="text-sky-600"   />
              <SummaryRow label="Private assets"  value={stats.private}  cls="text-amber-600" />
              <SummaryRow label="Internal assets" value={stats.internal} cls="text-red-600"   />
              <div className="border-t border-zinc-100 pt-2 mt-2">
                <SummaryRow label="Total assets" value={stats.total}                        />
                <SummaryRow label="Sections"     value={stats.sections}                     />
                <SummaryRow label="Featured"     value={guide.assets.filter(a => a.featured).length} />
              </div>
            </div>
          </div>

          {/* Sections at a glance */}
          {sections.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-3">Sections</p>
              <div className="space-y-1.5">
                {sections.map(s => {
                  const pubCount  = s.assets.filter(a => a.visibility === 'public').length
                  const privCount = s.assets.filter(a => a.visibility === 'private').length
                  const intCount  = s.assets.filter(a => a.visibility === 'internal').length
                  return (
                    <div key={s.category} className="flex items-center gap-2">
                      <div className="w-1 h-3.5 rounded-full bg-zinc-200 shrink-0" />
                      <span className="text-xs text-slate-600 flex-1 truncate">{s.category}</span>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        {pubCount  > 0 && <span className="text-sky-500   font-semibold">{pubCount}Pu</span>}
                        {privCount > 0 && <span className="text-amber-500 font-semibold">{privCount}Pr</span>}
                        {intCount  > 0 && <span className="text-red-500   font-semibold">{intCount}In</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Publish readiness */}
          <div>
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-3">Publish Readiness</p>
            <div className="space-y-2">
              {checks.map(c => (
                <div key={c.label} className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                    c.ok ? 'bg-emerald-100' : 'bg-zinc-100'
                  }`}>
                    {c.ok
                      ? <svg className="w-2.5 h-2.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      : <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                    }
                  </div>
                  <span className={`text-xs ${c.ok ? 'text-slate-600' : 'text-zinc-400'}`}>{c.label}</span>
                </div>
              ))}
            </div>
            {allPassed && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Ready to publish
              </div>
            )}
          </div>

          {guide.lastUpdated && (
            <p className="text-[11px] text-zinc-400 pt-2 border-t border-zinc-100">
              Last updated {guide.lastUpdated}
            </p>
          )}

        </div>
      </div>

      {/* ── Right: Live viewer preview ── */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Preview label */}
        <div className="h-8 shrink-0 bg-zinc-100 border-b border-zinc-200 flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            Live Preview — {guide.venueName || 'Your Guide'}
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
        </div>
        {/* Viewer */}
        <div className="flex-1 overflow-hidden">
          <ViewerPanel guide={guide} embedded />
        </div>
      </div>

    </div>
  )
}

// ─── Summary row ──────────────────────────────────────────────────────────────

function SummaryRow({ label, value, cls }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className={`text-xs font-bold tabular-nums ${cls || 'text-slate-700'}`}>{value}</span>
    </div>
  )
}
