// ─── Site configuration ───────────────────────────────────────────────────────
// Single source of truth for domain and layer routes.
//
// To adapt this for an additional customer:
//   1. Update SITE_BASE_URL to their subdomain or custom domain
//   2. Optionally update LAYER_ROUTES if their path structure differs
//
// All share links and internal navigation pull from this file — nothing
// is hard-coded elsewhere.

export const SITE_BASE_URL = 'https://xdsecure.xpansivedigital.ai'

export const LAYER_ROUTES = {
  public: {
    path:        '/public',
    label:       'Public View',
    description: 'Open access — no password required',
    color:       'sky',
  },
  private: {
    path:        '/private',
    label:       'Private Access',
    description: 'Password protected — for qualified clients',
    color:       'amber',
  },
  internal: {
    path:        '/internal',
    label:       'Internal Use Only',
    description: 'Restricted — authorised team members only',
    color:       'red',
  },
}

// Returns the full https URL for a given layer key.
export function layerUrl(layer) {
  const route = LAYER_ROUTES[layer]
  if (!route) return null
  return `${SITE_BASE_URL}${route.path}`
}

// Returns just the display-friendly host+path (no protocol prefix).
export function layerDisplayUrl(layer) {
  const url = layerUrl(layer)
  if (!url) return null
  return url.replace(/^https?:\/\//, '')
}
