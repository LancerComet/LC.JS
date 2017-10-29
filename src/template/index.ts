import { ASTNode } from './modules/ast'
import { parseHTMLtoAST } from './modules/parser'
import { isValueDirective, isEventDirective, isDirective } from '../directives'
import { NODE_TYPE } from '../core/config'

/**
 * Compile HTML tempalte to HTML elements.
 *
 * @param {string} $template
 * @param {$ComponentUsage} $components
 * @param {$ComponentModels} $models
 * @returns {DocumentFragment}
 */
function compile ($template: string, $components: $ComponentUsage, $models: $ComponentModels): DocumentFragment {
  // Create AST from component's template.
  const ast = parseHTMLtoAST($template, $components)

  // Transform ast to element.
  const fragment = document.createDocumentFragment()
  const astWithValue = replaceAstValue(ast, $models)
  astWithValue.forEach(astNode => {
    fragment.appendChild(
      createElementByASTNode(astNode, $components)
    )
  })

  return fragment
}

export {
  compile,
  parseHTMLtoAST
}

/**
 * Create element by using ASTNode.
 *
 * @param {ASTNode} astNode
 * @param {$ComponentUsage} $components
 * @param {Element} [parentElement]
 * @returns
 */
function createElementByASTNode (astNode: ASTNode, $components: $ComponentUsage, parentElement?: Element): HTMLElement | Text {
  let element: HTMLElement | Text = null

  switch (astNode.nodeType) {
    // Component anchor or html element.
    case NODE_TYPE.element:
      // Component anchor.
      if (astNode.componentAnchor) {
        const compInstance = <LC> new astNode.ComponentConstructor()

        // Save compInstance reference to $components.
        const $component = $components[astNode.componentName] || $components[astNode.tagName]
        if ($component) {
          $component.reference = compInstance
        }

        const mounter = document.createElement('div')
        compInstance.mount(mounter)
        element = mounter

      // HTML Element.
      } else {
        element = document.createElement(astNode.tagName)

        // Set attributes.
        const attributes = Object.keys(astNode.attributes)
        for (let i = 0, length = attributes.length; i < length; i++) {
          let attrName = attributes[i]
          const value = astNode.attributes[attrName]

          // Value directive.
          if (isValueDirective(attrName)) {
            attrName = attrName.replace(':', '')
          }

          // TODO: deal with function.
          if (isEventDirective(attrName)) {
            continue
          }

          element.setAttribute(attrName, value)
        }
      }

      // Create children.
      if (astNode.children.length) {
        for (let i = 0, length = astNode.children.length; i < length; i++) {
          const childAst = astNode.children[i]
          createElementByASTNode(childAst, $components, <HTMLElement> element)
        }
      }

      break

    // TextNode.
    case NODE_TYPE.textNode:
      element = document.createTextNode(astNode.textContent)
      break
  }

  // Append to parent element if it presets.
  parentElement && parentElement.appendChild(element)

  return element
}

/**
 * Fill expression in AST with target value.
 *
 * @param {AST} ast
 * @param {{[key: string]: ReactiveModel}} $models
 * @returns {AST}
 */
function replaceAstValue (ast: AST, $models: {[key: string]: ReactiveModel}): AST {
  ast = ast.slice()

  const keysOfModel = Object.keys($models)
  const valuesOfModel = keysOfModel.map(key => $models[key].value)

  ast.forEach((astNode: ASTNode, index: number) => {
    // No more children ASTNode, bottom arrived.
    switch (astNode.nodeType) {
      // Element.
      case NODE_TYPE.element:
        // Replace attribute.
        Object.keys(astNode.attributes).forEach(attrName => {
          if (!isDirective(attrName)) {
            return
          }

          // Extract expression from attribute value.
          const attrValue = astNode.attributes[attrName]
          const expressions = matchExpression(attrValue)

          if (!expressions) { return }

          expressions.forEach(expression => {
            const result = evaluateExpression(
              keysOfModel, valuesOfModel, getPureExpression(expression)
            )

            astNode.attributes[attrName] =
              attrValue.replace(expression, result)
          })
        })

        // If has children, just go further.
        if (astNode.children.length) {
          const transformedChildren = replaceAstValue(astNode.children, $models)
          astNode.children = transformedChildren
          return
        }

        break

      // TextContent.
      case NODE_TYPE.textNode:
        const expressions = matchExpression(astNode.textContent)
        if (!expressions) { return }

        expressions.forEach(expression => {
          const pureExpression = getPureExpression(expression)  // {{name}} => name
          const model = $models[pureExpression]

          // Calculate value and replace mastache expression.
          const result = evaluateExpression(
            keysOfModel, valuesOfModel, pureExpression
          )

          // Replace mastache expression.
          ast[index].textContent = ast[index].textContent.replace(expression, result)
        })

        break
    }
  })

  return ast
}

/**
 * Evaluate expression result.
 *
 * @param {string[]} variableName
 * @param {any[]} variableValue
 * @param {string} expression
 * @returns
 */
function evaluateExpression (variableName: string[], variableValue: any[], expression: string) {
  const evalFunc = Function.apply(
    null,
    variableName.concat('return ' + expression)
  )
  const result = evalFunc.apply(null, variableValue)
  return result
}

/**
 * Match expression from any html string.
 *
 * @param {string} string
 * @returns
 */
function matchExpression (string: string) {
  return string.match(/{{(\w|\d)+}}|{.+}/g)
}

/**
 * Get pure expression by removing mastache.
 *
 * @param {string} expression
 * @returns {string}
 */
function getPureExpression (expression: string): string {
  return expression.replace(/{|}/g, '')
}
