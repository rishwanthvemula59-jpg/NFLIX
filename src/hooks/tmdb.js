export const API_KEY = '4287ad07ac4b3b6fb565c8a5dcd46d8e'
export const BASE = 'https://api.themoviedb.org/3'
export const IMG = (path, size = 'w500') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null

export async function fetchTMDB(endpoint, params = '') {
  const r = await fetch(`${BASE}${endpoint}?api_key=${API_KEY}&language=en-US${params}`)
  return r.json()
}
