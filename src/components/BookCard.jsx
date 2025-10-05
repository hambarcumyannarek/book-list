import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaStar } from 'react-icons/fa'
import { AiOutlineEye } from 'react-icons/ai'
import styles from './BookCard.module.scss'
import { getLink, hasLink } from '../utils/util'
import placeholder from '../assets/images/placeholder.svg'

export default function BookCard({ book, onOpen }) {
  const [isHover, setIsHover] = useState(false)

  const stars = Array.from({ length: 5 }, (_, i) => (
    <FaStar key={i} className={i < book.rating ? styles.starActive : styles.star} />
  ))

  const isTopRated = book.rating === 5
  return (
    <motion.div
      className={`${styles.card} ${isTopRated ? styles.topRated : ''}`}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onHoverStart={() => setIsHover(true)}
      onHoverEnd={() => setIsHover(false)}
    >
      <div className={styles.imageWrap} onClick={() => onOpen(book)}>
        <img
          src={book.images?.[0] || placeholder}
          alt={book.title}
          loading="lazy"
          decoding="async"
          onError={(e) => { e.currentTarget.src = placeholder }}
        />
        <button className={styles.eyeBtn} onClick={() => onOpen(book)} aria-label={`Preview ${book.title}`}>
          <AiOutlineEye />
        </button>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{book.title}</h3>
        <p className={styles.author}>{book.author}</p>
        <p className={styles.summary}>{book.summary}</p>
        <div className={styles.footer}>
          <div className={styles.stars} data-hover={isHover}>
            {stars}
          </div>
          {hasLink(book.amazon) ? (
            <a className={styles.buyBtn} href={getLink(book.amazon)} target="_blank" rel="noreferrer">
              Buy on Amazon
            </a>
          ) : (
            <button className={styles.buyBtn} disabled aria-disabled="true">
              Not available
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}


