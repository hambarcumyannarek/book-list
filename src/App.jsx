import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AOS from 'aos'
import 'aos/dist/aos.css'
import styles from './App.module.scss'
import { books as allBooks } from './data/booksData'
import BookCard from './components/BookCard'
import BookModal from './components/BookModal'

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    AOS.init({ duration: 700, once: true, easing: 'ease-out' })
  }, [])

  const categories = useMemo(() => ['All', ...Array.from(new Set(allBooks.map(b => b.category || 'Other')))], [])

  const books = useMemo(() => {
    return allBooks.filter(b => {
      const matchesQuery = [b.title, b.author, b.summary].some(x => x.toLowerCase().includes(query.toLowerCase()))
      const matchesCategory = category === 'All' || b.category === category
      return matchesQuery && matchesCategory
    })
  }, [query, category])

  const openModal = (book) => {
    setSelected(book)
    setModalOpen(true)
  }

  const closeModal = () => setModalOpen(false)

  return (
    <div className={styles.app}>
      <div className={styles.progress} style={{ width: `${(typeof window !== 'undefined' ? (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100 : 0)}%` }} />
      <header className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroInner}>
          <h1> Reading List </h1>
          <p>A curated selection of books on technology, leadership, and innovation.</p>
          <div className={styles.controls}>
            <input
              className={styles.search}
              placeholder="Search by title, author, or summary"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select className={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button className={styles.themeToggle} onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>
          {books.map((book, idx) => (
            <motion.div key={book.title + idx} data-aos="fade-up">
              <BookCard book={book} onOpen={openModal} />
            </motion.div>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        Created by A - N
      </footer>

      <BookModal book={selected} isOpen={modalOpen} onClose={closeModal} />
    </div>
  )
}

export default App
