/**
 * Whether a directive is a value-expression directive.
 *
 * @param {string} directiveName
 * @returns
 */
function isValueDirective (directiveName: string) {
  return directiveName.indexOf(':') === 0
}

/**
 * Whether a directive is a event-function directive.
 *
 * @param {string} directiveName
 * @returns
 */
function isEventDirective (directiveName: string) {
  return directiveName.indexOf('@') === 0
}

/**
 * Whether a string is a vaild directive.
 *
 * @param {string} directiveName
 * @returns
 */
function isDirective (directiveName: string) {
  return isValueDirective(directiveName) ||
    isEventDirective(directiveName)
}

export {
  isDirective,
  isEventDirective,
  isValueDirective
}
