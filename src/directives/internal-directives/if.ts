import { DirectiveConfig } from '../../core/config'
import { createDirective } from '../modules/directive'

function initIf (directiveStore: {[directiveName: string]: typeof Directive}) {
  const DIRECTIVE_NAME = `${DirectiveConfig.flags.internal}if`

  directiveStore[DIRECTIVE_NAME] = createDirective({
    name: DIRECTIVE_NAME,
    isCustom: true,
    onInstall: exec,
    onUpdated: exec
  })
}

export {
  initIf
}

/**
 * If exec function.
 *
 * @param {Directive} directive
 * @param {boolean} value
 */
function exec (directive: Directive, value: boolean) {
  const { $ifAnchor, element } = directive.astNode
  value
    ? mountElement($ifAnchor, element)
    : unMountElement($ifAnchor, element)
}

/**
 * Mount element.
 *
 * @param {Comment} $ifAnchor
 * @param {(Element | Text | Comment)} element
 */
function mountElement ($ifAnchor: Comment, element: Element | Text | Comment) {
  const parent = $ifAnchor.parentElement
  if (!parent) {
    return
  }
  parent.insertBefore(element, $ifAnchor)
  parent.removeChild($ifAnchor)
}

/**
 * Unmount element.
 *
 * @param {Comment} $ifAnchor
 * @param {(Element | Text | Comment)} element
 */
function unMountElement ($ifAnchor: Comment, element: Element | Text | Comment) {
  const parent = element.parentElement
  if (!parent) {
    return
  }
  parent.insertBefore($ifAnchor, element)
  parent.removeChild(element)
}
