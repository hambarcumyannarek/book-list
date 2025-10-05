import { useEffect, useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoIosClose } from 'react-icons/io'
import { AiOutlineExpand } from 'react-icons/ai'
import styles from './BookModal.module.scss'
import ImageGalleryModal from './ImageGalleryModal'
import PdfPreviewModal from './PdfPreviewModal'
import { linkIsArray, hasLink, lockBodyScroll, unlockBodyScroll } from '../utils/util'
import placeholder from '../assets/images/placeholder.svg'

export default function BookModal({ book, isOpen, onClose }) {
  const [index, setIndex] = useState(0)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [isPdfOpen, setIsPdfOpen] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)

  const images = useMemo(() => book?.images || [], [book])

  useEffect(() => { setIndex(0) }, [book])

  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length])
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose, prev, next])

  useEffect(() => {
    if (isOpen) {
      lockBodyScroll()
      return () => unlockBodyScroll()
    }
  }, [isOpen])

  

  if (!book) return null

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            >
              <button className={styles.close} onClick={onClose} aria-label="Close">
                <IoIosClose size={28} />
              </button>

              <div className={styles.body}>
                <div className={styles.media}>
                {images.length > 0 && (
                    <button
                      className={styles.fullscreenBtn}
                      onClick={() => { setGalleryIndex(index); setIsGalleryOpen(true) }}
                      aria-label="Open fullscreen gallery"
                    >
                      <AiOutlineExpand size={18} />
                    </button>
                  )}
                  {images.length > 1 ? (
                    <div className={styles.slider}>
                      <button className={styles.navPrev} onClick={prev} aria-label="Previous image">‹</button>
                      <div className={styles.track} style={{ transform: `translateX(-${index * 100}%)` }}>
                        {images.map((src, idx) => (
                          <div key={idx} className={styles.slide}>
                            <img
                              src={src}
                              alt={`${book.title} ${idx+1}`}
                              loading="lazy"
                              decoding="async"
                              onClick={() => { setGalleryIndex(idx); setIsGalleryOpen(true) }}
                              onError={(e) => { e.currentTarget.src = placeholder }}
                            />
                          </div>
                        ))}
                      </div>
                      <button className={styles.navNext} onClick={next} aria-label="Next image">›</button>
                      <div className={styles.dots}>
                        {images.map((_, i) => (
                          <button
                            key={i}
                            className={i === index ? styles.dotActive : styles.dot}
                            onClick={() => setIndex(i)}
                            aria-label={`Go to image ${i+1}`}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <img
                      className={styles.single}
                      src={images?.[0] || placeholder}
                      alt={book.title}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => { e.currentTarget.src = placeholder }}
                      onClick={() => { setGalleryIndex(0); setIsGalleryOpen(true) }}
                    />
                  )}
                </div>
                <div className={styles.details}>
                  <h3>{book.title}</h3>
                  <p className={styles.author}>{book.author}</p>
                  <p className={styles.summary}>{book.summary}</p>
                  <div className={styles.actions}>
                    {book.pdf && (
                      <>
                        <a className={styles.pdfBtn} href={book.pdf} download>
                          Download PDF
                        </a>
                        <button className={styles.amazonBtn} onClick={() => setIsPdfOpen(true)}>
                          Preview PDF
                        </button>
                      </>
                    )}
                    {hasLink(book.amazon) && linkIsArray(book.amazon) ? (
                      <>
                        <a className={styles.amazonBtn} href={book.amazon?.[0]} target="_blank" rel="noreferrer">
                          Amazon (1st Edition)
                        </a>
                        <a className={styles.amazonBtn} href={book.amazon?.[1] || book.amazon?.[0]} target="_blank" rel="noreferrer">
                          Amazon (2nd Edition)
                        </a>
                      </>
                    ) : hasLink(book.amazon) ? (
                      <a className={styles.amazonBtn} href={book.amazon} target="_blank" rel="noreferrer">
                        Buy on Amazon
                      </a>
                    ) : (
                      <button className={styles.amazonBtn} disabled aria-disabled="true">
                        Not available on Amazon
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      <ImageGalleryModal
        images={images}
        isOpen={isGalleryOpen}
        initialIndex={galleryIndex}
        onClose={() => setIsGalleryOpen(false)}
      />
      <PdfPreviewModal
        src={book?.pdf}
        isOpen={isPdfOpen}
        onClose={() => setIsPdfOpen(false)}
        title={book?.title}
      />
      
    </>
  )
}


