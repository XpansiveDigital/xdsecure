import { useState } from 'react'
import BuilderPanel from './builder/BuilderPanel'
import ViewerPanel from './viewer/ViewerPanel'
import { demoVenue } from '../data/demoVenue'

// AppShell: top-level layout — logo, nav tabs, and view switching.
// Guide state lives here so Builder mutations are immediately reflected in the Viewer.
export default function AppShell() {
  const [activeTab, setActiveTab] = useState('viewer')
  const [guide, setGuide] = useState(demoVenue)

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      {/* Top nav */}
      <header className="bg-white border-b border-zinc-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-6 flex items-center justify-between h-16">

          {/* Logo + wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shadow-inner">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div className="flex flex-col -gap-0.5">
              <span className="text-[13px] font-semibold text-slate-900 leading-none tracking-tight">
                Venue Layer
              </span>
              <span className="text-[10px] text-zinc-400 font-medium tracking-widest uppercase leading-none mt-0.5">
                by XD
              </span>
            </div>
          </div>

          {/* Tab nav — centred */}
          <nav className="flex items-center gap-0.5 bg-zinc-100 rounded-xl p-1">
            {[
              { id: 'viewer', label: 'Published Guide' },
              { id: 'builder', label: 'Guide Builder' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-zinc-500 hover:text-slate-700 hover:bg-zinc-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right: status pill */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Live preview
            </span>
          </div>

        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'builder' ? (
          <BuilderPanel guide={guide} setGuide={setGuide} />
        ) : (
          <ViewerPanel guide={guide} />
        )}
      </main>
    </div>
  )
}
