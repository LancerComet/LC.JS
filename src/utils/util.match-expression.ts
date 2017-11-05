/**
 * Match expression from any html string.
 *
 * @param {string} string
 * @returns
 */
function matchExpression (string: string) {
  return string.match(/{{(\w|\d)+}}|{.+}/g)
}

export {
  matchExpression
}
