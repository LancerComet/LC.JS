import { DIRECTIVE } from '../../core/config'
import { strStartsWith } from '../../utils'

const eventFlag = DIRECTIVE.flags.event  // "@"
const valueFlag = DIRECTIVE.flags.value  // ":"

/**
 * Whether a directive is a event-function directive.
 *
 * @param {string} directiveName
 * @returns
 */
function isEventDirective (directiveName: string) {
  return strStartsWith(directiveName, eventFlag)
}

/**
 * Whether a directive is a value-expression directive.
 *
 * @param {string} directiveName
 * @returns
 */
function isValueDirective (directiveName: string) {
  return strStartsWith(directiveName, valueFlag)
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
