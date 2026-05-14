import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useMyList } from '../context/FavoritesContext'
import { IMG, fetchTMDB } from '../hooks/tmdb'
import MovieRow from '../components/MovieRow'
import styles from './MovieDetail.module.css'

export default function MovieDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [similar, setSimilar] = useState([])
  const [loading, setLoading] = useState(true)
  const { toggle, inList } = useMyList()

  useEffect(() => {
    window.scrollTo(0, 0)
    setLoading(true)
    Promise.all([
      fetchTMDB(`/movie/${id}`, '&append_to_response=credits,videos,images'),
      fetchTMDB(`/movie/${id}/similar`),
      fetchTMDB(`/movie/${id}/recommendations`),
    ]).then(([m, sim, rec]) => {
      setMovie(m)
      setSimilar([...(rec.results || []), ...(sim.results || [])].slice(0, 20))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className={styles.loadWrap}>
      <div className={`${styles.backdropLoad} skeleton`} />
      <div className={styles.loadContent}>
        <div className={`${styles.skTitle} skeleton`} />
        <div className={`${styles.skText} skeleton`} />
        <div className={`${styles.skText} skeleton`} />
      </div>
    </div>
  )

  if (!movie || movie.status_message) return (
    <div className={styles.notFound}>
      <h2>Movie not found</h2>
      <button onClick={() => navigate('/')}>Go Home</button>
    </div>
  )

  const backdrop = IMG(movie.backdrop_path, 'original')
  const poster = IMG(movie.poster_path, 'w500')
  const saved = inList(movie.id)
  const trailer = movie.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')
  const director = movie.credits?.crew?.find(c => c.job === 'Director')
  const writers = movie.credits?.crew?.filter(c => c.job === 'Screenplay' || c.job === 'Writer').slice(0, 2)
  const cast = movie.credits?.cast?.slice(0, 10) || []
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null
  const score = movie.vote_average ? Math.round(movie.vote_average * 10) : null
  const year = movie.release_date?.slice(0, 4)
  const age = movie.adult ? '18+' : '13+'

  return (
    <div className={styles.page}>
      {/* Backdrop */}
      <div className={styles.backdropWrap}>
        {backdrop && <img src={backdrop} alt="" className={styles.backdropImg} />}
        <div className={styles.backdropGradient} />
      </div>

      {/* Main content */}
      <div className={styles.content}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Back
        </button>

        <div className={styles.mainGrid}>
          {/* Poster */}
          <div className={styles.posterCol}>
            {poster
              ? <img src={poster} alt={movie.title} className={styles.poster} />
              : <div className={`${styles.noPoster} skeleton`}>🎬</div>
            }
          </div>

          {/* Info */}
          <div className={styles.infoCol}>
            <h1 className={styles.title}>{movie.title}</h1>
            {movie.tagline && <p className={styles.tagline}>{movie.tagline}</p>}

            {/* Stats row */}
            <div className={styles.statsRow}>
              {score && <span className={styles.match}>{score}% Match</span>}
              {year && <span className={styles.pill}>{year}</span>}
              {runtime && <span className={styles.pill}>{runtime}</span>}
              <span className={styles.pill}>{age}</span>
              <span className={styles.pillHD}>HD</span>
            </div>

            {/* Genres */}
            <div className={styles.genres}>
              {movie.genres?.map(g => (
                <span key={g.id} className={styles.genre}>{g.name}</span>
              ))}
            </div>

            {/* Overview */}
            <p className={styles.overview}>{movie.overview}</p>

            {/* Action buttons */}
            <div className={styles.actions}>
              {trailer
                ? <a href={`https://youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noreferrer" className={styles.playBtn}>
                    <svg viewBox="0 0 24 24" fill="black" width="22" height="22"><path d="M8 5v14l11-7z"/></svg>
                    Play Trailer
                  </a>
                : <Link to={`/movie/${id}`} className={styles.playBtn}>
                    <svg viewBox="0 0 24 24" fill="black" width="22" height="22"><path d="M8 5v14l11-7z"/></svg>
                    Play
                  </Link>
              }
              <button className={`${styles.myListBtn} ${saved ? styles.saved : ''}`} onClick={() => toggle(movie)}>
                {saved
                  ? <><svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> In My List</>
                  : <><svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg> My List</>
                }
              </button>
            </div>

            {/* Details grid */}
            <div className={styles.details}>
              {director && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Director:</span>
                  <span className={styles.detailValue}>{director.name}</span>
                </div>
              )}
              {writers?.length > 0 && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Writers:</span>
                  <span className={styles.detailValue}>{writers.map(w => w.name).join(', ')}</span>
                </div>
              )}
              {cast.length > 0 && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Cast:</span>
                  <span className={styles.detailValue}>{cast.slice(0, 5).map(a => a.name).join(', ')}</span>
                </div>
              )}
              {movie.production_countries?.[0] && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Country:</span>
                  <span className={styles.detailValue}>{movie.production_countries[0].name}</span>
                </div>
              )}
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Rating:</span>
                <span className={styles.detailValue} style={{ color: '#f5c518' }}>
                  ⭐ {movie.vote_average?.toFixed(1)} / 10 ({movie.vote_count?.toLocaleString()} votes)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cast row */}
        {cast.length > 0 && (
          <div className={styles.castSection}>
            <h3 className={styles.sectionTitle}>Cast</h3>
            <div className={styles.castGrid}>
              {cast.map(actor => (
                <div key={actor.id} className={styles.actorCard}>
                  <div className={styles.actorImg}>
                    {actor.profile_path
                      ? <img src={IMG(actor.profile_path, 'w185')} alt={actor.name} />
                      : <div className={styles.actorPlaceholder}>👤</div>
                    }
                  </div>
                  <div className={styles.actorInfo}>
                    <span className={styles.actorName}>{actor.name}</span>
                    <span className={styles.actorChar}>{actor.character}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* More like this */}
        {similar.length > 0 && (
          <div className={styles.moreSection}>
            <MovieRow title="More Like This" movies={similar} loading={false} />
          </div>
        )}
      </div>
    </div>
  )
}
