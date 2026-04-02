// AssetRenderer: displays the selected asset in the main content panel.
// Rendering strategy by type:
//   embed  → iframe (Matterport, external embed URLs)
//   video  → iframe (YouTube/Vimeo embed URLs)
//   pdf    → iframe with PDF URL
//   image  → responsive <img>
//   fallback → open-in-new-tab button

// "Vetted" tag — shown on vetted-only assets
const VETTED_TAG = (
  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5 tracking-wide">
    Vetted
  </span>
)

function OpenTabFallback({ url }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center">
        <svg className="w-7 h-7 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-sm text-slate-700 font-medium mb-1">Direct preview not available</p>
        <p className="text-xs text-zinc-400 mb-4">This asset can be opened in a separate tab.</p>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition shadow-sm"
          >
            Open in New Tab
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        ) : (
          <p className="text-xs text-zinc-400">No URL provided for this asset.</p>
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
          className="w-full h-full border-0 rounded-xl"
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
          className="w-full h-full border-0 rounded-xl"
          type="application/pdf"
        />
      )
    case 'image':
      return (
        <div className="w-full h-full flex items-center justify-center p-6 bg-zinc-50 rounded-xl overflow-hidden">
          <img
            src={asset.url}
            alt={asset.name}
            className="max-w-full max-h-full object-contain rounded-lg shadow-md"
          />
        </div>
      )
    default:
      return <OpenTabFallback url={asset.url} />
  }
}

export default function AssetRenderer({ asset, isEnhancedMode }) {
  if (!asset) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
            </svg>
          </div>
          <p className="text-sm text-zinc-400">Select an asset from the sidebar to view it here.</p>
        </div>
      </div>
    )
  }

  const isVetted = asset.visibility === 'vetted' || asset.visibility === 'secure'

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Asset header */}
      <div className="px-6 py-4 border-b border-zinc-100 bg-white flex items-start justify-between gap-4 shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-base font-semibold text-slate-900 tracking-tight truncate">
              {asset.name}
            </h2>
            {/* Show Vetted tag when viewing a vetted asset in enhanced mode */}
            {isVetted && isEnhancedMode && VETTED_TAG}
          </div>
          {asset.description && (
            <p className="text-sm text-zinc-500 mt-0.5 line-clamp-2 leading-relaxed">
              {asset.description}
            </p>
          )}
        </div>
        {asset.url && (
          <a
            href={asset.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-medium text-slate-600 hover:bg-zinc-50 hover:border-zinc-300 transition"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            Open
          </a>
        )}
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden p-4 bg-zinc-50">
        {renderContent(asset)}
      </div>
    </div>
  )
}
