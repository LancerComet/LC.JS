import { ASTNodeComponent, ASTNodeElement, ASTNodeText } from '../../core'
import { isValueDirective, isEventDirective, isDirective } from '../../directives'
import { DirectiveConfig, NodeType } from '../../core/config'
import { nextTick } from '../../utils'
import { ReactiveModel } from '../../component/modules/reactive-model'

/**
 * Create HTML Elements by AST.
 *
 * @param {AST} ast AST.
 * @param {LC} component Component that the AST belongs to.
 * @returns {Element}
 */
function compileAstToElement (ast: AST, component: LC): DocumentFragment {
  const fragment = document.createDocumentFragment()
  const $components = component.$components
  const $models = component.$models

  for (let i = 0, length = ast.nodes.length; i < length; i++) {
    const astNode: ASTNodeTypes = ast.nodes[i]

    // Fill all values to expression.
    astNode.update()

    switch (true) {
      // ASTNodeComponent.
      case astNode instanceof ASTNodeComponent:
        const componentNode = <ASTNodeComponent> astNode
        const props = componentNode.props

        // Deal with props if there is.
        const propsKeys = Object.keys(props).map(transformPropNameToPascal)
        if (propsKeys.length) {
          const $presetModels = {}

          // Create prop's reactive model for target component.
          propsKeys.forEach(propName => {
            $presetModels[propName] = new ReactiveModel(ast, propName, {
              type: $models[propName].type,
              default: $models[propName].value
            })
          })

          // Combine props to Component's "$models".
          Object.defineProperty(componentNode.ComponentCtor.prototype, '$models', {
            value: Object.assign(
              componentNode.ComponentCtor.prototype.$models,
              $presetModels
            )
          })
        }

        // TODO: Can't instantiate component in here.
        const compInstance: LC = new (<ASTNodeComponent> astNode).ComponentCtor()

        // Save child component "compInstance" to "$propComponents" in prop's model in this component.
        propsKeys.forEach(propName => {
          const $propModel = <ReactiveModel> $models[propName]
        })

        // Mount component.
        componentNode.componentInstance = compInstance
        componentNode.mountComponent()

        // Save component instance to component.
        $components[astNode.tagName].reference.push(compInstance)
        break

      // ASTNodeElement.
      case astNode instanceof ASTNodeElement:
        // Append children elements.
        const childAST = (<ASTNodeElement> astNode).childAST
        if (childAST.nodes.length) {
          const childrenElements = compileAstToElement(childAST, component)
          astNode.element.appendChild(childrenElements)
        }
        break

      // ASTNodeText.
      case astNode instanceof ASTNodeText:
        break
    }

    fragment.appendChild(astNode.element)
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
  const replaceRegExp = new RegExp(DirectiveConfig.flags.value, 'g')

  if (matching) {
    let result = propName
    matching.forEach(item => {
      result = result.replace(
        item,
        item.replace(new RegExp('-'), '').toUpperCase()
      )
    })

    return result.replace(replaceRegExp, '')
  } else {
    return propName.replace(replaceRegExp, '')
  }
}
