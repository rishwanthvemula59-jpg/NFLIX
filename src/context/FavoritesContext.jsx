import { createContext, useContext, useState, useEffect } from 'react'

const Ctx = createContext()

export function FavoritesProvider({ children }) {
  const [list, setList] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nf_mylist') || '[]') }
    catch { return [] }
  })
  useEffect(() => { localStorage.setItem('nf_mylist', JSON.stringify(list)) }, [list])
  const toggle = (movie) => setList(prev =>
    prev.find(m => m.id === movie.id) ? prev.filter(m => m.id !== movie.id) : [...prev, movie]
  )
  const inList = (id) => list.some(m => m.id === id)
  return <Ctx.Provider value={{ list, toggle, inList }}>{children}</Ctx.Provider>
}

export const useMyList = () => useContext(Ctx)
