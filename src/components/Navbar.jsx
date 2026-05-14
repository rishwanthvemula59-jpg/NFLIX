import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useMyList } from '../context/FavoritesContext'
import styles from './Navbar.module.css'

const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Movies', to: '/?cat=movies' },
  { label: 'TV Shows', to: '/?cat=tv' },
  { label: 'New & Popular', to: '/?cat=new' },
  { label: 'My List', to: '/my-list' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const inputRef = useRef()
  const navigate = useNavigate()
  const location = useLocation()
  const { list } = useMyList()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
      setSearchOpen(false)
    }
  }

  return (
    <header className={`${styles.nav} ${scrolled ? styles.solid : ''}`}>
      <div className={styles.left}>
        {/* Netflix-style N logo */}
        <Link to="/" className={styles.logo}>
          <svg viewBox="0 0 111 30" fill="var(--netflix-red)" aria-hidden="true" focusable="false">
            <g>
              <path d="M105.062 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 7.969c-1.687-.282-3.344-.376-5.031-.595l6.031-13.75L94.468 0h5.063l3.062 7.874L105.875 0h5.124l-5.937 14.28zM90.47 0h-4.594v27.25c1.5.094 3.062.156 4.594.343V0zm-8.937 26.937c-4.187-.375-8.375-.656-12.625-.781V0h4.595v22c2.75.094 5.5.312 8.03.531v4.406zM50.063 12.5h6.531v4.375h-6.53v9.968h-4.594V0h13.187v4.406H50.063V12.5zM34.97 0H30.47v26.25c1.5.031 3.03.094 4.5.187V0zM26.498 0h-4.562l-.032 17.156L13.468 0H8.996v25.406a505.9 505.9 0 0 1 4.5.343V8.187l8.937 17.812c1.5.126 3 .282 4.5.438L26.498 0zM0 5.562V0h13.468v4.375H4.687V30C3.093 29.75 1.5 29.5 0 29.25V5.562z"/>
            </g>
          </svg>
        </Link>

        <nav className={styles.navLinks}>
          {LINKS.map(l => (
            <Link
              key={l.label}
              to={l.to}
              className={`${styles.navLink} ${location.pathname === l.to.split('?')[0] && !l.to.includes('?') && l.to !== '/?cat=movies' ? styles.active : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Mobile browse */}
        <button className={styles.mobileBrowse} onClick={() => setMobileOpen(o => !o)}>
          Browse <span className={styles.chevron}>▾</span>
        </button>
      </div>

      <div className={styles.right}>
        {/* Search */}
        <form className={`${styles.searchBox} ${searchOpen ? styles.searchOpen : ''}`} onSubmit={handleSearch}>
          <button type="button" className={styles.iconBtn} onClick={() => setSearchOpen(o => !o)}>
            <SearchIcon />
          </button>
          <input
            ref={inputRef}
            type="text"
            placeholder="Titles, people, genres"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className={styles.searchInput}
          />
        </form>

        {/* Notifications */}
        <button className={styles.iconBtn}><BellIcon /></button>

        {/* Avatar + dropdown */}
        <div className={styles.profileWrap}>
          <div className={styles.avatar}>
            <div className={styles.avatarInner}>U</div>
            <span className={styles.caret}>▾</span>
          </div>
          <div className={styles.dropdown}>
            <div className={styles.dropProfile}>
              <div className={styles.dropAvatar}>U</div>
              <span>User</span>
            </div>
            <div className={styles.dropDivider} />
            <Link to="/my-list" className={styles.dropItem}>My List {list.length > 0 && <span className={styles.badge}>{list.length}</span>}</Link>
            <div className={styles.dropDivider} />
            <span className={styles.dropItem}>Account</span>
            <span className={styles.dropItem}>Help Center</span>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {LINKS.map(l => (
            <Link key={l.label} to={l.to} className={styles.mobileLink} onClick={() => setMobileOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
  </svg>
)
