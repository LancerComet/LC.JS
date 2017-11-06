import { DirectiveConfig } from '../../core/config'
import { strStartsWith } from '../../utils'

const { event: eventFlag, value: valueFlag, internal: internalFlag } = DirectiveConfig.flags

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
 * Whether a directive is a internal directive.
 *
 * @param {string} directiveName
 * @returns
 */
function isInternalDirective (directiveName: string) {
  return strStartsWith(directiveName, internalFlag)
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
    isEventDirective(directiveName) ||
    isInternalDirective(directiveName)
}

export {
  isDirective,
  isEventDirective,
  isInternalDirective,
  isValueDirective
}
