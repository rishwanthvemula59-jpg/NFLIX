import { useRef, useState } from 'react'
import MovieCard from './MovieCard'
import styles from './MovieRow.module.css'

export default function MovieRow({ title, movies = [], loading = false }) {
  const rowRef = useRef()
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const scroll = (dir) => {
    const el = rowRef.current
    if (!el) return
    const amount = el.clientWidth * 0.85
    el.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  const onScroll = () => {
    const el = rowRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 10)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 10)
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.rowTitle}>{title}</h2>
      <div className={styles.sliderWrap}>
        {/* Left arrow */}
        {!atStart && (
          <button className={`${styles.handle} ${styles.handleLeft}`} onClick={() => scroll(-1)}>
            <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
        )}

        {/* Right arrow */}
        {!atEnd && (
          <button className={`${styles.handle} ${styles.handleRight}`} onClick={() => scroll(1)}>
            <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        )}

        <div className={styles.row} ref={rowRef} onScroll={onScroll}>
          {loading
            ? Array(8).fill(0).map((_, i) => (
                <div key={i} className={`${styles.skeletonCard} skeleton`} />
              ))
            : movies.map(m => <MovieCard key={m.id} movie={m} />)
          }
        </div>
      </div>
    </section>
  )
}
