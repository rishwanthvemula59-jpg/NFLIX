import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchTMDB } from '../hooks/tmdb'
import MovieCard from '../components/MovieCard'
import styles from './Search.module.css'

export default function Search() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (!q) return
    setLoading(true)
    setResults([])
    setPage(1)
    fetchTMDB('/search/movie', `&query=${encodeURIComponent(q)}&page=1`)
      .then(d => {
        setResults(d.results || [])
        setTotal(d.total_results || 0)
        setTotalPages(d.total_pages || 1)
        setLoading(false)
      }).catch(() => setLoading(false))
  }, [q])

  const loadMore = () => {
    const next = page + 1
    fetchTMDB('/search/movie', `&query=${encodeURIComponent(q)}&page=${next}`)
      .then(d => {
        setResults(prev => [...prev, ...(d.results || [])])
        setPage(next)
      })
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        {q && !loading && (
          <>
            <h1 className={styles.heading}>
              {results.length > 0 ? `Results for "${q}"` : `No results for "${q}"`}
            </h1>
            {total > 0 && <p className={styles.sub}>{total.toLocaleString()} titles found</p>}
          </>
        )}
        {loading && <h1 className={styles.heading}>Searching...</h1>}
        {!q && <h1 className={styles.heading}>Search for a movie</h1>}
      </div>

      {loading && (
        <div className={styles.grid}>
          {Array(12).fill(0).map((_, i) => (
            <div key={i} className={`${styles.skelCard} skeleton`} />
          ))}
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <div className={styles.grid}>
            {results.map(m => <MovieCard key={m.id} movie={m} />)}
          </div>
          {page < totalPages && (
            <div className={styles.more}>
              <button className={styles.moreBtn} onClick={loadMore}>Load More</button>
            </div>
          )}
        </>
      )}

      {!loading && q && results.length === 0 && (
        <div className={styles.empty}>
          <p>😕 No movies found for <strong>"{q}"</strong></p>
          <p className={styles.hint}>Try different keywords or check your spelling.</p>
        </div>
      )}
    </div>
  )
}
