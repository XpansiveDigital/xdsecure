import ViewerPanel from '../viewer/ViewerPanel'
import { getGuideStats } from '../../lib/guideUtils'

export default function PreviewPublishTab({ guide, setGuide, onNavigate }) {
  const stats = getGuideStats(guide)

  function handlePublish() {
    setGuide(g => ({
      ...g,
      publishStatus: g.publishStatus === 'published' ? 'draft' : 'published',
    }))
  }

  const isPublished = guide.publishStatus === 'published'

  return (
    <div className="h-full flex flex-col">

      {/* ── Publish bar ── */}
      <div className="shrink-0 bg-white border-b border-zinc-200 px-6 h-14 flex items-center gap-5">

        {/* Status badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
          isPublished
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
            : 'bg-zinc-50 border-zinc-200 text-zinc-600'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
          {isPublished ? 'Published' : 'Draft'}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <span>
            <strong className="text-slate-700 font-semibold">{stats.sales}</strong> Sales
          </span>
          <span>
            <strong className="text-slate-700 font-semibold">+{stats.vetted}</strong> Vetted
          </span>
          <span>
            <strong className="text-slate-700 font-semibold">{stats.total}</strong> Total
          </span>
        </div>

        {/* Divider */}
        <div className="flex-1" />

        {/* Share link placeholder */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs ${
            isPublished ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-50 border-zinc-200 opacity-50'
          }`}>
            <svg className="w-3 h-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
            <span className={isPublished ? 'text-slate-600 font-medium' : 'text-zinc-400'}>
              {isPublished ? 'venueguide.io/grand-assembly' : 'Link available when published'}
            </span>
          </div>
          {isPublished && (
            <button
              className="p-1.5 rounded-lg text-zinc-400 hover:text-slate-600 hover:bg-zinc-100 transition"
              title="Copy link"
              onClick={() => navigator.clipboard?.writeText('https://venueguide.io/grand-assembly')}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
            </button>
          )}
        </div>

        {/* Publish button */}
        <button
          onClick={handlePublish}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition shadow-sm ${
            isPublished
              ? 'bg-white border border-zinc-200 text-slate-700 hover:bg-zinc-50'
              : 'bg-slate-900 text-white hover:bg-slate-700'
          }`}
        >
          {isPublished ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              Unpublish
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Publish Guide
            </>
          )}
        </button>

      </div>

      {/* ── Embedded viewer ── */}
      <div className="flex-1 overflow-hidden">
        <ViewerPanel guide={guide} embedded />
      </div>

    </div>
  )
}
