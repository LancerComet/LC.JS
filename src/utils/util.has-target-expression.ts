/**
 * Check if specificExpression is in wholeExpression.
 *
 * @param {string} wholeExpression
 * @param {string} specificExpression
 * @returns {boolean}
 *
 * @example
 *  hasTargetExpression('"My name is: " + name', 'name')
 */
function hasTargetExpression (wholeExpression: string, specificExpression: string): boolean {
  return !!wholeExpression.match(new RegExp('\\b' + specificExpression + '\\b'))
}

export {
  hasTargetExpression
}
