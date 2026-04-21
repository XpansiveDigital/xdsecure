// ViewToggle: 3-layer tab switcher used in the admin preview.
// activeLayer: 'public' | 'private' | 'internal'

const LAYERS = [
  {
    id:    'public',
    label: 'Public',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    id:    'private',
    label: 'Private',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    id:    'internal',
    label: 'Internal',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
]

export default function ViewToggle({ activeLayer, onLayerChange }) {
  const dark = activeLayer === 'internal'

  return (
    <div className={`flex items-center gap-0.5 rounded-xl p-1 transition-colors duration-300 ${
      dark ? 'bg-white/[0.07] border border-white/[0.06]' : 'bg-zinc-100/80'
    }`}>
      {LAYERS.map(layer => {
        const isActive = activeLayer === layer.id
        return (
          <button
            key={layer.id}
            onClick={() => onLayerChange(layer.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
              isActive
                ? dark
                  ? 'bg-white/10 text-white'
                  : 'bg-white text-slate-900 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.05)]'
                : dark
                  ? 'text-white/45 hover:text-white/80 hover:bg-white/[0.06]'
                  : 'text-zinc-500 hover:text-slate-700 hover:bg-white/70'
            }`}
          >
            {layer.icon}
            {layer.label}
          </button>
        )
      })}
    </div>
  )
}
