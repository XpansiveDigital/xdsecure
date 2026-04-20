import { useState } from 'react'
import OverviewTab        from './admin/OverviewTab'
import AssetsTab          from './admin/AssetsTab'
import ExperienceBuilderTab from './admin/ExperienceBuilderTab'
import PreviewPublishTab  from './admin/PreviewPublishTab'
import ViewerPanel        from './viewer/ViewerPanel'
import { demoVenue }      from '../data/demoVenue'

// ─── Tab definitions ──────────────────────────────────────────────────────────

const ADMIN_TABS = [
  {
    id: 'overview',
    label: 'Overview',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    id: 'assets',
    label: 'Assets',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
      </svg>
    ),
  },
  {
    id: 'builder',
    label: 'Builder',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
  },
  {
    id: 'publish',
    label: 'Preview & Publish',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

// ─── AppShell ─────────────────────────────────────────────────────────────────

export default function AppShell() {
  const [activeTab, setActiveTab] = useState('overview')
  const [guide, setGuide] = useState(demoVenue)

  const isViewerTab = activeTab === 'viewer'

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-zinc-200 shadow-sm h-14 flex items-center">
        <div className="w-full px-5 flex items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0 w-44">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <div>
              <div className="text-[13px] font-bold text-slate-900 leading-none tracking-tight">Venue Layer</div>
              <div className="text-[9px] text-zinc-400 font-semibold tracking-widest uppercase leading-none mt-0.5">by XD</div>
            </div>
          </div>

          {/* Centre nav */}
          <nav className="flex items-center gap-0.5 flex-1 justify-center">
            {/* Admin tabs */}
            {ADMIN_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-slate-700 hover:bg-zinc-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}

            {/* Divider */}
            <div className="w-px h-4 bg-zinc-200 mx-2" />

            {/* Viewer tab */}
            <button
              onClick={() => setActiveTab('viewer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                activeTab === 'viewer'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-slate-700 hover:bg-zinc-100'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Published Guide
            </button>
          </nav>

          {/* Right: status */}
          <div className="flex items-center gap-2 shrink-0 w-44 justify-end">
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
              guide.publishStatus === 'published'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-zinc-100 text-zinc-500 border-zinc-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                guide.publishStatus === 'published' ? 'bg-emerald-500' : 'bg-zinc-400'
              }`} />
              {guide.publishStatus === 'published' ? 'Published' : 'Draft'}
            </span>
          </div>

        </div>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'overview' && (
          <OverviewTab guide={guide} setGuide={setGuide} onNavigate={setActiveTab} />
        )}
        {activeTab === 'assets' && (
          <AssetsTab guide={guide} setGuide={setGuide} />
        )}
        {activeTab === 'builder' && (
          <ExperienceBuilderTab guide={guide} setGuide={setGuide} />
        )}
        {activeTab === 'publish' && (
          <PreviewPublishTab guide={guide} setGuide={setGuide} onNavigate={setActiveTab} />
        )}
        {activeTab === 'viewer' && (
          <div className="h-full">
            <ViewerPanel guide={guide} />
          </div>
        )}
      </main>

    </div>
  )
}
