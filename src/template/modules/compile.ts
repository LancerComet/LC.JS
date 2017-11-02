import { isValueDirective, isEventDirective, isDirective } from '../../directives/modules/utils'
import { NODE_TYPE } from '../../core/config'
import { nextTick } from '../../utils'

/**
 * Create HTML Elements by AST.
 *
 * @param {AST} ast
 * @param {LC} component
 * @param {$ComponentUsage} $components
 * @param {$ComponentModels} $models
 * @returns {Element}
 */
function compileAstToElement (ast: AST, component: LC, $components: $ComponentUsage, $models: $ComponentModels): DocumentFragment {
  const fragment = document.createDocumentFragment()

  for (let i = 0, length = ast.length; i < length; i++) {
    const astNode = ast[i]

    // Fill all values to expression.
    astNode.updateElement(component)

    const element = astNode.element
    const childElement = compileAstToElement(astNode.children, component, $components, $models)

    // Append children elements.
    if (childElement && astNode.nodeType === NODE_TYPE.element) {
      element.appendChild(childElement)
    }

    fragment.appendChild(element)

    // Mount element if this is a component anchor.
    if (astNode.nodeType === NODE_TYPE.comment && astNode.isComponentAnchor) {
      const compInstance: LC = new astNode.ComponentCtor()
      compInstance.mount(<Element> astNode.element)

      // Save component instance to component.
      $components[astNode.tagName].reference.push(compInstance)
    }
  }

  return fragment
}

export {
  compileAstToElement
}