import { useMyList } from '../context/FavoritesContext'
import MovieCard from '../components/MovieCard'
import styles from './MyList.module.css'

export default function MyList() {
  const { list } = useMyList()

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>My List</h1>
      <p className={styles.sub}>{list.length} title{list.length !== 1 ? 's' : ''}</p>

      {list.length === 0
        ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="60" height="60">
                <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </div>
            <h2>Your list is empty</h2>
            <p>Add movies by hovering over a title and clicking <strong>+</strong></p>
          </div>
        )
        : (
          <div className={styles.grid}>
            {list.map(m => <MovieCard key={m.id} movie={m} />)}
          </div>
        )
      }
    </div>
  )
}
