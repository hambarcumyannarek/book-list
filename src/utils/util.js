function linkIsArray(link) {
  return Array.isArray(link)
}


function getLink(link) {
  return linkIsArray(link) ? link[link.length-1] : link
}

export { linkIsArray, getLink }