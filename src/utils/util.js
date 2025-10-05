function linkIsArray(link) {
  return Array.isArray(link)
}


function getLink(link) {
  return linkIsArray(link) ? link[link.length-1] : link
}

// Body scroll lock with reference counting to support nested modals
let scrollLockCount = 0
let previousOverflow = ''
let previousPaddingRight = ''
let previousPosition = ''
let previousTop = ''
let storedScrollY = 0

function lockBodyScroll() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return
  if (scrollLockCount === 0) {
    previousOverflow = document.body.style.overflow
    previousPaddingRight = document.body.style.paddingRight
    previousPosition = document.body.style.position
    previousTop = document.body.style.top
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }
    storedScrollY = window.scrollY || window.pageYOffset || 0
    document.body.style.position = 'fixed'
    document.body.style.top = `-${storedScrollY}px`
    document.body.style.overflow = 'hidden'
    document.body.style.width = '100%'
  }
  scrollLockCount += 1
}

function unlockBodyScroll() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return
  if (scrollLockCount > 0) {
    scrollLockCount -= 1
    if (scrollLockCount === 0) {
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
      document.body.style.position = previousPosition
      document.body.style.top = previousTop
      document.body.style.width = ''
      window.scrollTo(0, storedScrollY)
    }
  }
}

export { linkIsArray, getLink, lockBodyScroll, unlockBodyScroll }