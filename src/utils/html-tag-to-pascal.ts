/**
 * Convert HTML tag name to pascal style.
 *
 * @param {string} tagName
 * @returns {string}
 */
function htmlTagToPascal (tagName: string): string {
  const matching = tagName.match(/-\w/)
  if (matching) {
    matching.forEach(item => {
      tagName = tagName.replace(item, item.replace('-', '').toUpperCase())
    })
  }
  return tagName.replace(tagName[0], tagName[0].toUpperCase())
}

export {
  htmlTagToPascal
}
