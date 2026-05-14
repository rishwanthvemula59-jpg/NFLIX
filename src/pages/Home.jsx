import { useState, useEffect } from 'react'
import { fetchTMDB } from '../hooks/tmdb'
import Hero from '../components/Hero'
import MovieRow from '../components/MovieRow'
import styles from './Home.module.css'

const ROWS = [
  { title: 'Trending Now',           endpoint: '/trending/movie/week' },
  { title: 'Popular on Netflix',     endpoint: '/movie/popular' },
  { title: 'Top Rated',              endpoint: '/movie/top_rated' },
  { title: 'New Releases',           endpoint: '/movie/now_playing' },
  { title: 'Coming Soon',            endpoint: '/movie/upcoming' },
  { title: 'Action & Adventure',     endpoint: '/discover/movie', extra: '&with_genres=28' },
  { title: 'Comedy',                 endpoint: '/discover/movie', extra: '&with_genres=35' },
  { title: 'Thrillers',              endpoint: '/discover/movie', extra: '&with_genres=53' },
  { title: 'Horror',                 endpoint: '/discover/movie', extra: '&with_genres=27' },
  { title: 'Sci-Fi',                 endpoint: '/discover/movie', extra: '&with_genres=878' },
  { title: 'Romance',                endpoint: '/discover/movie', extra: '&with_genres=10749' },
  { title: 'Animation',              endpoint: '/discover/movie', extra: '&with_genres=16' },
  { title: 'Documentaries',          endpoint: '/discover/movie', extra: '&with_genres=99' },
]

function Row({ row }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTMDB(row.endpoint, row.extra || '')
      .then(d => { setMovies(d.results || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [row.endpoint, row.extra])

  return <MovieRow title={row.title} movies={movies} loading={loading} />
}

export default function Home() {
  const [trending, setTrending] = useState([])
  const [heroLoading, setHeroLoading] = useState(true)

  useEffect(() => {
    fetchTMDB('/trending/movie/week')
      .then(d => { setTrending(d.results || []); setHeroLoading(false) })
      .catch(() => setHeroLoading(false))
  }, [])

  return (
    <div className={styles.home}>
      {heroLoading
        ? <div className={`${styles.heroSkeleton} skeleton`} />
        : <Hero movies={trending} />
      }
      <div className={styles.rows}>
        {ROWS.map(row => <Row key={row.title} row={row} />)}
      </div>
    </div>
  )
}
