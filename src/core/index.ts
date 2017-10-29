/// <reference path="./index.d.ts" />

import { ASTNode } from '../template/modules/ast'

import { parseHTMLtoAST, createElementByASTNode } from '../template'
import { isDirective } from '../directives'
import { nextTick } from '../utils/next-tick'

/**
 * LC.JS.
 * Class LC is the basic class of a component.
 * You should extend this class to create a component class.
 *
 * @abstract
 * @class {LC} Class that performs basic class of any component.
 */
abstract class LC {
  /**
   * Component reference in this component.
   *
   * @private
   * @type {$ComponentUsage}
   * @memberof LC
   */
  private $components: $ComponentUsage

  /**
   * Model storage.
   *
   * @implements
   * @type {{ [key: string]: ReactiveModel }}
   * @memberof LC
   */
  private $models: $ComponentModels

  /**
   * Template string.
   *
   * @implements
   * @type {string}
   * @memberof LC
   */
  private $template: string

  /**
   * Move models to root level.
   *
   * @private
   * @memberof LC
   */
  private $moveModelToRootLevel () {
    // "$models" would be undefined when a new instance is created in decorator.
    // Just skip in this case.
    if (typeof this.$models !== 'object') { return }

    Object.keys(this.$models).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable: true,
        get: () => this.$models[key].value,
        set (newValue) {
          this.$models[key].value = newValue
        }
      })
    })
  }

  /**
   * Mount this component to target element.
   *
   * @param {(string | Element)} element
   * @memberof LC
   */
  mount (element: string | Element) {
    // Get mounting element.
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el) {
      return
    }

    let $template = this.$template

    // Try to get template from el if $template is empty.
    if (!$template) {
      const tempElement = document.createElement('div')
      tempElement.appendChild(el.cloneNode(true))
      $template = tempElement.innerHTML
    }

    // Compile tempalte to component.
    const fragment = compile($template, this.$components, this.$models)

    nextTick(() => {
      const parent = el.parentElement
      parent.insertBefore(fragment, el)
      parent.removeChild(el)
    })
  }

  constructor () {
    this.$moveModelToRootLevel()
  }
}

export {
  LC
}

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
      createElementByASTNode(astNode)
    )
  })

  return fragment
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
      case 1:
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
      case 3:
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
