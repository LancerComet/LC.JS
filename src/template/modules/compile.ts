import { isValueDirective, isEventDirective, isDirective } from '../../directives'
import { NODE_TYPE } from '../../core/config'

/**
 * Create HTML Elements by AST.
 *
 * @param {AST} ast
 * @param {$ComponentUsage} $components
 * @param {$ComponentModels} $models
 * @returns {Element}
 */
function compileAstToElement (ast: AST, $components: $ComponentUsage, $models: $ComponentModels): DocumentFragment {
  const fragment = document.createDocumentFragment()

  for (let i = 0, length = ast.length; i < length; i++) {
    const astNode = ast[i]
    astNode.updateElement($models)

    const element = astNode.element
    const childElement = compileAstToElement(astNode.children, $components, $models)

    if (childElement && astNode.nodeType === NODE_TYPE.element) {
      element.appendChild(childElement)
    }

    fragment.appendChild(element)
  }

  return fragment
}

export {
  compileAstToElement
}
