import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useMyList } from '../context/FavoritesContext'
import { IMG } from '../hooks/tmdb'
import styles from './Hero.module.css'

export default function Hero({ movies = [] }) {
  const [idx, setIdx] = useState(0)
  const { toggle, inList } = useMyList()
  const movie = movies[idx]

  useEffect(() => {
    if (movies.length < 2) return
    const t = setInterval(() => setIdx(i => (i + 1) % Math.min(movies.length, 6)), 8000)
    return () => clearInterval(t)
  }, [movies.length])

  if (!movie) return <div className={`${styles.heroSkeleton} skeleton`} />

  const bg = IMG(movie.backdrop_path, 'original')
  const saved = inList(movie.id)
  const score = movie.vote_average?.toFixed(1)
  const year = movie.release_date?.slice(0, 4)
  const age = movie.adult ? '18+' : '13+'

  return (
    <div className={styles.hero}>
      {/* Background */}
      <div className={styles.backdrop} style={{ backgroundImage: bg ? `url(${bg})` : 'none' }} />

      {/* Vignettes — exactly like Netflix */}
      <div className={styles.vignetteTop} />
      <div className={styles.vignetteLeft} />
      <div className={styles.vignetteBottom} />

      {/* Content */}
      <div className={styles.content} key={movie.id}>
        {/* Netflix Original badge */}
        <div className={styles.netflixOriginal}>
          <svg viewBox="0 0 111 30" fill="var(--netflix-red)" width="56" height="16">
            <g><path d="M105.062 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 7.969c-1.687-.282-3.344-.376-5.031-.595l6.031-13.75L94.468 0h5.063l3.062 7.874L105.875 0h5.124l-5.937 14.28zM90.47 0h-4.594v27.25c1.5.094 3.062.156 4.594.343V0zm-8.937 26.937c-4.187-.375-8.375-.656-12.625-.781V0h4.595v22c2.75.094 5.5.312 8.03.531v4.406zM50.063 12.5h6.531v4.375h-6.53v9.968h-4.594V0h13.187v4.406H50.063V12.5zM34.97 0H30.47v26.25c1.5.031 3.03.094 4.5.187V0zM26.498 0h-4.562l-.032 17.156L13.468 0H8.996v25.406a505.9 505.9 0 0 1 4.5.343V8.187l8.937 17.812c1.5.126 3 .282 4.5.438L26.498 0zM0 5.562V0h13.468v4.375H4.687V30C3.093 29.75 1.5 29.5 0 29.25V5.562z"/></g>
          </svg>
          <span className={styles.originalText}>ORIGINAL</span>
        </div>

        <h1 className={styles.title}>{movie.title || movie.name}</h1>
        <p className={styles.overview}>{movie.overview?.slice(0, 160)}{movie.overview?.length > 160 ? '...' : ''}</p>

        <div className={styles.meta}>
          <span className={styles.match}>
            <span className={styles.matchIcon}>✓</span> {Math.round(score * 10)}% Match
          </span>
          <span className={styles.metaTag}>{year}</span>
          <span className={styles.ageRating}>{age}</span>
        </div>

        <div className={styles.actions}>
          <Link to={`/movie/${movie.id}`} className={styles.btnPlay}>
            <svg viewBox="0 0 24 24" fill="black" width="22" height="22">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Play
          </Link>

          <button
            className={`${styles.btnSecondary} ${saved ? styles.btnSaved : ''}`}
            onClick={() => toggle(movie)}
          >
            {saved
              ? <><CheckIcon /> In My List</>
              : <><PlusIcon /> My List</>
            }
          </button>

          <Link to={`/movie/${movie.id}`} className={styles.btnInfo}>
            <InfoIcon />
            More Info
          </Link>
        </div>
      </div>

      {/* Dot indicators */}
      <div className={styles.indicators}>
        {movies.slice(0, 6).map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === idx ? styles.dotActive : ''}`}
            onClick={() => setIdx(i)}
          />
        ))}
      </div>

      {/* Age rating badge bottom-right — exactly Netflix */}
      <div className={styles.ratingBadge}>{age}</div>
    </div>
  )
}

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
)
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
)
const InfoIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
  </svg>
)
