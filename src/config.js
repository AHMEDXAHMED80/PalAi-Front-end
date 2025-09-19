// Central API base for frontend requests. Use Vite env var when provided, otherwise fall back to the proxy path '/api'.
// Normalize API base and provide helper to build API paths.
const rawBase = import.meta.env.VITE_API_BASE || '/api'
// strip trailing slash if present
export const API_BASE = rawBase.replace(/\/$/, '')

// helper: ensure the returned url is API_BASE + provided path (with single slash)
export function apiPath(path) {
	if (!path) return API_BASE
	const p = path.startsWith('/') ? path : `/${path}`
	return `${API_BASE}${p}`
}
