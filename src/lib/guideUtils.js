// Shared utilities and config for the Venue Layer prototype.

// ─── Asset type config ────────────────────────────────────────────────────────

export const TYPE_CONFIG = {
  embed: {
    label:   'Virtual Tour',
    abbr:    'Tour',
    bg:      'bg-indigo-100',
    text:    'text-indigo-600',
    dot:     'bg-indigo-500',
    iconPath: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418',
  },
  pdf: {
    label:   'PDF / Floorplan',
    abbr:    'PDF',
    bg:      'bg-amber-100',
    text:    'text-amber-600',
    dot:     'bg-amber-500',
    iconPath: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
  },
  image: {
    label:   'Image',
    abbr:    'Image',
    bg:      'bg-emerald-100',
    text:    'text-emerald-600',
    dot:     'bg-emerald-500',
    iconPath: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z',
  },
  video: {
    label:   'Video',
    abbr:    'Video',
    bg:      'bg-rose-100',
    text:    'text-rose-600',
    dot:     'bg-rose-500',
    iconPath: 'M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z',
  },
  link: {
    label:   'External Link',
    abbr:    'Link',
    bg:      'bg-purple-100',
    text:    'text-purple-600',
    dot:     'bg-purple-500',
    iconPath: 'M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25',
  },
}

// ─── Visibility config ────────────────────────────────────────────────────────

export const VISIBILITY_CONFIG = {
  both: {
    label: 'Sales + Vetted',
    short: 'Both',
    pill:  'bg-slate-100 text-slate-600 border border-slate-200',
  },
  sales: {
    label: 'Sales Only',
    short: 'Sales',
    pill:  'bg-sky-50 text-sky-700 border border-sky-200',
  },
  vetted: {
    label: 'Vetted Access',
    short: 'Vetted',
    pill:  'bg-amber-50 text-amber-700 border border-amber-200',
  },
}

// ─── Section helpers ──────────────────────────────────────────────────────────

export function getSectionOrder(guide) {
  if (guide.sectionOrder?.length) return guide.sectionOrder
  const seen = new Set()
  const order = []
  for (const asset of guide.assets || []) {
    if (!seen.has(asset.category)) {
      seen.add(asset.category)
      order.push(asset.category)
    }
  }
  return order
}

export function getSections(guide) {
  const order = getSectionOrder(guide)
  const grouped = {}
  for (const asset of guide.assets || []) {
    if (!grouped[asset.category]) grouped[asset.category] = []
    grouped[asset.category].push(asset)
  }
  // Sections in sectionOrder, then any stray categories
  const all = [...order]
  for (const cat of Object.keys(grouped)) {
    if (!all.includes(cat)) all.push(cat)
  }
  return all
    .filter(cat => grouped[cat]?.length > 0)
    .map(cat => ({ category: cat, assets: grouped[cat] }))
}

// ─── Guide stats ──────────────────────────────────────────────────────────────

export function getGuideStats(guide) {
  const assets = guide.assets || []
  const salesAssets  = assets.filter(a => a.visibility === 'both' || a.visibility === 'sales')
  const vettedOnly   = assets.filter(a => a.visibility === 'vetted')
  const bothAssets   = assets.filter(a => a.visibility === 'both')
  const sections     = [...new Set(assets.map(a => a.category))]
  return {
    total:      assets.length,
    sales:      salesAssets.length,
    vetted:     vettedOnly.length,
    both:       bothAssets.length,
    sections:   sections.length,
    readyCount: assets.filter(a => a.status === 'ready').length,
  }
}

// ─── Asset guide mutations ────────────────────────────────────────────────────

let _nextId = 100
export function nextAssetId() {
  return String(_nextId++)
}
