import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import MovieDetail from './pages/MovieDetail'
import MyList from './pages/MyList'
import Search from './pages/Search'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--netflix-black)' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/my-list" element={<MyList />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </div>
  )
}
