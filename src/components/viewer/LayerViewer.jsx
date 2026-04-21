import { useState, useEffect } from 'react'
import { demoVenue }     from '../../data/demoVenue'
import { getLayerAssets, getSections, TYPE_CONFIG } from '../../lib/guideUtils'

// ─── Load persisted guide (falls back to demo data) ───────────────────────────

const STORAGE_KEY = 'xd_guide_v1'

function loadGuide() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return { ...demoVenue, ...JSON.parse(saved) }
  } catch {}
  return demoVenue
}
import AccessGate        from './AccessGate'
import AssetNavigation   from './AssetNavigation'
import AssetRenderer     from './AssetRenderer'

// ─── Layer config ─────────────────────────────────────────────────────────────

const LAYER_CONFIG = {
  public: {
    label:        'Public View',
    badge:        'Public',
    badgeCls:     'bg-sky-50 text-sky-700 border-sky-200',
    dotCls:       'bg-sky-500',
    description:  'Open access — available to anyone with this link.',
    dark:         false,
    requiresAuth: false,
    passwordKey:  null,
    hintKey:      null,
  },
  private: {
    label:        'Private Access',
    badge:        'Private',
    badgeCls:     'bg-amber-50 text-amber-700 border-amber-200',
    dotCls:       'bg-amber-500',
    description:  'Shared with qualified clients and approved contacts.',
    dark:         false,
    requiresAuth: true,
    passwordKey:  'accessCode',
    hintKey:      'accessCodeHint',
  },
  internal: {
    label:        'Internal Use Only',
    badge:        'Internal',
    badgeCls:     'bg-red-50 text-red-700 border-red-200',
    dotCls:       'bg-red-500',
    description:  'For authorised team members only — do not distribute.',
    dark:         true,
    requiresAuth: true,
    passwordKey:  'internalAccessCode',
    hintKey:      'internalAccessCodeHint',
  },
}

// ─── LayerViewer ──────────────────────────────────────────────────────────────

export default function LayerViewer({ layer = 'public' }) {
  const guide  = loadGuide()
  const config = LAYER_CONFIG[layer] || LAYER_CONFIG.public
  const dark   = config.dark

  const [isUnlocked, setIsUnlocked] = useState(!config.requiresAuth)
  const [selectedId, setSelectedId] = useState(null)

  const visibleAssets = getLayerAssets(guide.assets, layer)

  // Auto-select first asset once unlocked
  useEffect(() => {
    if (isUnlocked && visibleAssets.length > 0) {
      setSelectedId(prev => {
        const stillVisible = visibleAssets.find(a => a.id === prev)
        return stillVisible ? prev : visibleAssets[0].id
      })
    }
  }, [isUnlocked, layer])

  const selectedAsset = guide.assets.find(a => a.id === selectedId)

  return (
    <div className="h-screen flex flex-col overflow-hidden">

      {/* ── Internal warning banner ── */}
      {layer === 'internal' && isUnlocked && (
        <div className="shrink-0 bg-red-950/80 border-b border-red-800/60 px-6 py-2 flex items-center justify-center gap-2">
          <svg className="w-3.5 h-3.5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <span className="text-xs font-semibold text-red-300/90 tracking-wide">
            INTERNAL USE ONLY — For authorised team members. Do not distribute externally.
          </span>
        </div>
      )}

      {/* ── Header ── */}
      <header className={`h-14 shrink-0 flex items-center border-b px-6 transition-colors ${
        dark ? 'bg-slate-950 border-white/[0.07]' : 'bg-white border-zinc-200'
      }`}>
        <div className="flex items-center justify-between w-full gap-4">

          {/* Venue identity */}
          <div className="min-w-0 flex-1">
            <div className={`text-sm font-bold tracking-tight leading-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
              {guide.venueName}
            </div>
            <div className={`text-xs leading-tight mt-0.5 ${dark ? 'text-white/38' : 'text-zinc-400'}`}>
              {guide.guideName}
            </div>
          </div>

          {/* Layer badge */}
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border shrink-0 ${config.badgeCls}`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dotCls}`} />
            {config.badge}
          </span>

        </div>
      </header>

      {/* ── Body ── */}
      {!isUnlocked ? (
        <AccessGate
          layer={layer}
          password={guide[config.passwordKey]}
          hint={config.hintKey ? guide[config.hintKey] : ''}
          onUnlock={() => setIsUnlocked(true)}
        />
      ) : (
        <div className="flex flex-1 overflow-hidden min-h-0">

          {/* Sidebar */}
          <aside className={`w-60 shrink-0 border-r overflow-y-auto scrollbar-thin transition-colors ${
            dark ? 'bg-slate-950 border-white/[0.07]' : 'bg-white border-zinc-200'
          }`}>
            <AssetNavigation
              guide={guide}
              layer={layer}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </aside>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col min-w-0">
            <AssetRenderer asset={selectedAsset} layer={layer} />
          </div>

        </div>
      )}

    </div>
  )
}
