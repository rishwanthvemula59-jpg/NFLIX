import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMyList } from '../context/FavoritesContext'
import { IMG } from '../hooks/tmdb'
import styles from './MovieCard.module.css'

export default function MovieCard({ movie }) {
  const { toggle, inList } = useMyList()
  const [hovered, setHovered] = useState(false)
  const timerRef = useRef()
  const saved = inList(movie.id)
  const poster = IMG(movie.poster_path)
  const backdrop = IMG(movie.backdrop_path, 'w500')
  const year = movie.release_date?.slice(0, 4) || movie.first_air_date?.slice(0, 4) || ''
  const score = movie.vote_average ? Math.round(movie.vote_average * 10) : null
  const title = movie.title || movie.name || ''

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => setHovered(true), 400)
  }
  const handleMouseLeave = () => {
    clearTimeout(timerRef.current)
    setHovered(false)
  }

  return (
    <div
      className={`${styles.card} ${hovered ? styles.hovered : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Poster */}
      <div className={styles.poster}>
        <img
          src={poster || backdrop || '/placeholder.png'}
          alt={title}
          loading="lazy"
          onError={e => { e.target.style.opacity = '0' }}
        />
        {!poster && !backdrop && <div className={styles.noPoster}>🎬</div>}
      </div>

      {/* Netflix hover preview card */}
      {hovered && (
        <div className={styles.preview}>
          <div className={styles.previewImg}>
            <img src={backdrop || poster || ''} alt={title} />
            <div className={styles.previewOverlay} />
          </div>

          <div className={styles.previewBody}>
            <div className={styles.previewActions}>
              <Link to={`/movie/${movie.id}`} className={styles.playBtn}>
                <svg viewBox="0 0 24 24" fill="black" width="18" height="18"><path d="M8 5v14l11-7z"/></svg>
              </Link>
              <button
                className={`${styles.circleBtn} ${saved ? styles.circleSaved : ''}`}
                onClick={(e) => { e.stopPropagation(); toggle(movie) }}
                title={saved ? 'Remove from list' : 'Add to My List'}
              >
                {saved
                  ? <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  : <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                }
              </button>
              <button className={styles.circleBtn} title="Like">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                </svg>
              </button>
              <Link to={`/movie/${movie.id}`} className={`${styles.circleBtn} ${styles.infoBtn}`} title="More info">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
                </svg>
              </Link>
            </div>

            <p className={styles.previewTitle}>{title}</p>

            <div className={styles.previewMeta}>
              {score && <span className={styles.match}>{score}% Match</span>}
              {year && <span className={styles.metaText}>{year}</span>}
              <span className={styles.rating}>HD</span>
            </div>

            {movie.genre_ids?.length > 0 && (
              <div className={styles.genres}>
                {['Action', 'Drama', 'Thriller', 'Comedy', 'Horror'].slice(0, 3).map((g, i) => (
                  <span key={i} className={styles.genreTag}>
                    {i > 0 && <span className={styles.dot}>•</span>}{g}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
