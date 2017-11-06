import { isValueDirective, isEventDirective, isDirective } from '../../directives'
import { DirectiveConfig, NodeType } from '../../core/config'
import { nextTick } from '../../utils'
import { ReactiveModel } from '../../component/modules/reactive-model'

/**
 * Create HTML Elements by AST.
 *
 * @param {AST} ast AST.
 * @param {LC} component Component that the AST belongs to.
 * @param {$ComponentUsage} $components Quick reference to "component.$components".
 * @param {$ComponentModels} $models Quick reference to "component.$models".
 * @returns {Element}
 */
function compileAstToElement (ast: AST, component: LC, $components: $ComponentUsage, $models: $ComponentModels): DocumentFragment {
  const fragment = document.createDocumentFragment()

  for (let i = 0, length = ast.nodes.length; i < length; i++) {
    const astNode: ASTNode = ast.nodes[i]

    // Fill all values to expression.
    astNode.update(component)

    // Append children elements.
    if (astNode.childAST.nodes.length && astNode.nodeType === NodeType.element) {
      const childrenElements = compileAstToElement(astNode.childAST, component, $components, $models)
      astNode.element.appendChild(childrenElements)
    }

    fragment.appendChild(astNode.element)

    // Mount element if this is a component anchor.
    if (astNode.nodeType === NodeType.comment && astNode.isComponentAnchor) {
      // Deal with props if there is.
      const props = astNode.props
      const propsKeys = Object.keys(props).map(transformPropNameToPascal)
      if (propsKeys.length) {
        const $presetModels = {}

        // Create new reactive model for child component for initial values.
        propsKeys.forEach(propName => {
          $presetModels[propName] = new ReactiveModel(propName, {
            type: $models[propName].type,
            default: $models[propName].value
          })
        })

        // Combine props to Component's "$models".
        Object.defineProperty(astNode.ComponentCtor.prototype, '$models', {
          value: Object.assign(
            astNode.ComponentCtor.prototype['$models'],
            $presetModels
          )
        })
      }

      // TODO: Can't instantiate component in here.
      const compInstance: LC = new astNode.ComponentCtor()

      // Save child component "compInstance" to "$propComponents" in prop's model in this component.
      propsKeys.forEach(propName => {
        const $propModel = <ReactiveModel> $models[propName]
        $propModel.$propComponents.push(compInstance)
      })

      // Mount component.
      astNode.componentInstance = compInstance
      astNode.mountComponent()

      // Save component instance to component.
      $components[astNode.tagName].reference.push(compInstance)
    }
  }

  return fragment
}

export {
  compileAstToElement,
  transformPropNameToPascal
}

/**
 * Transform prop name to pascal name.
 *
 * @param {string} propName
 * @returns {string}
 *
 * @example
 *  transformPropNameToPascal(':app-name')  // ':appName'
 */
function transformPropNameToPascal (propName: string) {
  const matching = propName.match(/-\w/g)
  if (matching) {
    let result = propName
    matching.forEach(item => {
      result = result.replace(
        item,
        item.replace(new RegExp('-'), '').toUpperCase()
      )
    })

    return result.replace(new RegExp(DirectiveConfig.flags.value, 'g'), '')
  } else {
    return propName
  }
}
