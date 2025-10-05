import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IoIosClose } from 'react-icons/io'
import styles from './ImageGalleryModal.module.scss'
import placeholder from '../assets/images/placeholder.svg'

export default function ImageGalleryModal({ images: inputImages, isOpen, initialIndex = 0, onClose }) {
  const images = useMemo(() => inputImages || [], [inputImages])
  const [index, setIndex] = useState(initialIndex)
  const [zoomed, setZoomed] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setIndex(Math.min(Math.max(initialIndex, 0), Math.max(images.length - 1, 0)))
    setZoomed(false)
  }, [isOpen, initialIndex, images.length])

  const prev = useCallback(() => {
    if (images.length === 0) return
    setIndex((i) => (i - 1 + images.length) % images.length)
  }, [images.length])

  const next = useCallback(() => {
    if (images.length === 0) return
    setIndex((i) => (i + 1) % images.length)
  }, [images.length])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose, prev, next])

  if (!isOpen) return null

  return (
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
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          >
            <button className={styles.close} onClick={onClose} aria-label="Close fullscreen gallery">
              <IoIosClose size={28} />
            </button>

            <div className={styles.slider}>
              <button className={styles.navPrev} onClick={prev} aria-label="Previous image">‹</button>
              <div className={styles.track} style={{ transform: `translateX(-${index * 100}%)` }}>
                {images.map((src, i) => (
                  <div key={i} className={styles.slide}>
                    <img
                      src={src}
                      alt={`Image ${i + 1}`}
                      loading="eager"
                      decoding="async"
                      className={`${styles.zoomable} ${zoomed ? styles.zoomed : ''}`}
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        const x = ((e.clientX - rect.left) / rect.width) * 100
                        const y = ((e.clientY - rect.top) / rect.height) * 100
                        e.currentTarget.style.setProperty('--tx', `${x}%`)
                        e.currentTarget.style.setProperty('--ty', `${y}%`)
                        if (!zoomed) {
                          e.currentTarget.style.setProperty('--scale', '1.5')
                          setZoomed(true)
                        } else {
                          e.currentTarget.style.setProperty('--scale', '1')
                          setZoomed(false)
                        }
                      }}
                      onError={(e) => { e.currentTarget.src = placeholder }}
                    />
                  </div>
                ))}
              </div>
              <button className={styles.navNext} onClick={next} aria-label="Next image">›</button>
            </div>

            <div className={styles.dots}>
              {images.map((_, i) => (
                <button
                  key={i}
                  className={i === index ? styles.dotActive : styles.dot}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

