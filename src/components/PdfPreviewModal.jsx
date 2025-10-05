import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IoIosClose } from 'react-icons/io'
import styles from './PdfPreviewModal.module.scss'
import { lockBodyScroll, unlockBodyScroll } from '../utils/util'

export default function PdfPreviewModal({ src, isOpen, onClose, title }) {
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      lockBodyScroll()
      return () => unlockBodyScroll()
    }
  }, [isOpen])

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
            <button className={styles.close} onClick={onClose} aria-label="Close PDF preview">
              <IoIosClose size={28} />
            </button>

            <div className={styles.frame}>
              {src ? (
                <iframe src={src} title={title || 'PDF Preview'} loading="eager" />
              ) : (
                <div className={styles.fallback}>
                  <p>PDF not available.</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


