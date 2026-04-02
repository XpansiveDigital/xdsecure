// AssetList: renders all assets in the builder as card rows.
// Supports edit, delete, and up/down reordering.

const TYPE_LABELS = {
  embed: 'Embed',
  pdf: 'PDF',
  image: 'Image',
  video: 'Video',
}

const VISIBILITY_STYLES = {
  both:   { pill: 'bg-slate-100 text-slate-600 border border-slate-200',   label: 'Sales + Vetted' },
  sales:  { pill: 'bg-zinc-100 text-zinc-500 border border-zinc-200',       label: 'Sales Only' },
  vetted: { pill: 'bg-amber-50 text-amber-700 border border-amber-200',     label: 'Vetted Access' },
}

export default function AssetList({ assets, onEdit, onDelete, onMove }) {
  if (assets.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-400 text-sm">
        No assets yet — click "Add Asset" above to get started.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {assets.map((asset, index) => {
        const vis = VISIBILITY_STYLES[asset.visibility] || VISIBILITY_STYLES.both
        return (
          <div
            key={asset.id}
            className="flex items-center gap-3 bg-white rounded-xl border border-zinc-100 px-4 py-3 group hover:border-zinc-300 hover:shadow-sm transition-all"
          >
            {/* Reorder controls */}
            <div className="flex flex-col gap-0.5 shrink-0">
              <button
                onClick={() => onMove(index, -1)}
                disabled={index === 0}
                className="w-6 h-6 rounded flex items-center justify-center text-zinc-300 hover:text-slate-600 hover:bg-zinc-100 disabled:opacity-25 disabled:cursor-not-allowed transition"
                title="Move up"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
              </button>
              <button
                onClick={() => onMove(index, 1)}
                disabled={index === assets.length - 1}
                className="w-6 h-6 rounded flex items-center justify-center text-zinc-300 hover:text-slate-600 hover:bg-zinc-100 disabled:opacity-25 disabled:cursor-not-allowed transition"
                title="Move down"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>

            {/* Asset info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-slate-800 truncate">{asset.name}</span>
                <span className="text-[11px] text-zinc-400 bg-zinc-100 rounded px-1.5 py-0.5 shrink-0 font-medium">
                  {TYPE_LABELS[asset.type] || asset.type}
                </span>
                <span className="text-[11px] text-zinc-400">{asset.category}</span>
              </div>
              {asset.description && (
                <p className="text-xs text-zinc-400 truncate mt-0.5">{asset.description}</p>
              )}
            </div>

            {/* Visibility badge */}
            <span className={`text-[11px] font-semibold rounded-full px-2.5 py-1 shrink-0 ${vis.pill}`}>
              {vis.label}
            </span>

            {/* Actions — appear on hover */}
            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(asset)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-slate-700 hover:bg-zinc-100 transition"
                title="Edit"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(asset.id)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-600 hover:bg-red-50 transition"
                title="Remove"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
