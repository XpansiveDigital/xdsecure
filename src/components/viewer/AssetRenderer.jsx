import { TYPE_CONFIG } from '../../lib/guideUtils'

// AssetRenderer: renders the selected asset in the main viewer panel.
// Props:
//   asset — the selected asset object
//   layer — 'public' | 'private' | 'internal'

function OpenTabFallback({ url }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 bg-stone-50">
      <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)] flex items-center justify-center">
        <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </div>
      <div className="text-center max-w-xs">
        <p className="text-sm font-semibold text-slate-700 mb-1">Opens in a new tab</p>
        <p className="text-xs text-zinc-400 mb-5 leading-relaxed">This asset opens in your browser rather than displaying inline.</p>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 active:scale-[0.98] transition shadow-sm"
          >
            Open Asset
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        ) : (
          <p className="text-xs text-zinc-400">No URL configured for this asset.</p>
        )}
      </div>
    </div>
  )
}

function renderContent(asset) {
  if (!asset.url) return <OpenTabFallback url={null} />
  switch (asset.type) {
    case 'embed':
    case 'video':
      return (
        <iframe
          key={asset.id}
          src={asset.url}
          title={asset.name}
          className="w-full h-full border-0"
          allowFullScreen
          allow="xr-spatial-tracking; fullscreen"
        />
      )
    case 'pdf':
      return (
        <iframe
          key={asset.id}
          src={asset.url}
          title={asset.name}
          className="w-full h-full border-0"
          type="application/pdf"
        />
      )
    case 'image':
      return (
        <div className="w-full h-full flex items-center justify-center p-8 bg-stone-50 overflow-hidden">
          <img
            src={asset.url}
            alt={asset.name}
            className="max-w-full max-h-full object-contain rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08),0_12px_32px_rgba(0,0,0,0.08)]"
          />
        </div>
      )
    case 'link':
    default:
      return <OpenTabFallback url={asset.url} />
  }
}

// Visibility badge config
const VIS_BADGE = {
  private:  { label: 'Private',  cls: 'text-amber-700 bg-amber-50 border-amber-200/80' },
  internal: { label: 'Internal', cls: 'text-red-700 bg-red-50 border-red-200/80' },
}

export default function AssetRenderer({ asset, layer }) {
  if (!asset) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-stone-50">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)] flex items-center justify-center mx-auto mb-4">
            <svg className="w-5 h-5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-zinc-500">Select an asset to view it here</p>
          <p className="text-xs text-zinc-400 mt-0.5">Use the navigation on the left</p>
        </div>
      </div>
    )
  }

  const tc      = TYPE_CONFIG[asset.type] || TYPE_CONFIG.link
  const visBadge = VIS_BADGE[asset.visibility]
  // Show visibility badge only when viewing a layer where it adds context
  const showVisBadge = visBadge && (layer === 'private' || layer === 'internal')

  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* Asset header */}
      <div className="px-6 py-4 border-b border-zinc-100 bg-white flex items-start justify-between gap-4 shrink-0">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5 flex-wrap">

            {/* Type badge */}
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${tc.bg} ${tc.text}`}>
              <svg style={{width:'10px',height:'10px'}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={tc.iconPath} />
              </svg>
              {tc.abbr}
            </span>

            <h2 className="text-[15px] font-bold text-slate-900 tracking-tight leading-snug">
              {asset.name}
            </h2>

            {/* Featured badge */}
            {asset.featured && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 rounded-full px-2 py-0.5">
                <svg className="w-2.5 h-2.5 fill-amber-500" viewBox="0 0 24 24">
                  <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                Featured
              </span>
            )}

            {/* Visibility badge */}
            {showVisBadge && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold border rounded-full px-2 py-0.5 ${visBadge.cls}`}>
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                {visBadge.label}
              </span>
            )}
          </div>

          {/* Description */}
          {asset.description && (
            <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed max-w-xl">
              {asset.description}
            </p>
          )}
        </div>

        {/* Open in new tab */}
        {asset.url && (
          <a
            href={asset.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-slate-500 hover:text-slate-800 hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.97] transition"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            Open
          </a>
        )}
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden bg-stone-50">
        {renderContent(asset)}
      </div>

    </div>
  )
}
