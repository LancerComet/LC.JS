/// <reference path="./index.d.ts" />

import { ReactiveModel } from '../component/modules/reactive-model'
import { parseHTMLtoAST, createElementByASTNode } from '../template'
import { ASTNode, TemplateAST } from '../template/modules/ast-node'

/**
 * LC.JS.
 * Class LC is the basic class of a component.
 * You should extend this class to create a component class.
 *
 * @abstract
 * @class {LC} Class that performs basic class of any component.
 */
abstract class LC implements ILcBaseProperties {
  /**
   * Model storage.
   *
   * @implements
   * @type {{ [key: string]: ReactiveModel }}
   * @memberof LC
   */
  $models: {[key: string]: ReactiveModel}

  /**
   * Template string.
   *
   * @implements
   * @type {string}
   * @memberof LC
   */
  $template: string

  /**
   * Replace root level properties to accessor.
   *
   * @private
   * @memberof LC
   */
  private $replaceProps () {
    // "$models" would be undefined when a new instance is created in decorator.
    // Just skip this function in that process.
    if (typeof this.$models !== 'object') { return }

    Object.keys(this.$models).forEach(key => {
      Object.defineProperty(this, key, {
        get: () => this.$models[key].value,
        set (newValue) {
          this.$models[key].value = newValue
        }
      })
    })
  }

  /**
   * Compile tempalte to elements.
   *
   * @private
   * @memberof LC
   */
  private $compile (): DocumentFragment {
    // Create AST from component's template.
    const ast = parseHTMLtoAST(this.$template)

    // Transform ast to element.
    const fragment = document.createDocumentFragment()
    const astWithValue = transformAST(ast, this.$models)
    astWithValue.forEach(astNode => {
      const element = createElementByASTNode(astNode)
      fragment.appendChild(element)
    })

    return fragment
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

    if (!el) { return }

    // Compile tempalte to component.
    const fragment = this.$compile()

    Promise.resolve().then(() => {
      el.innerHTML = ''
      el.appendChild(fragment)
    })
  }

  constructor () {
    this.$replaceProps()
  }
}

export {
  LC
}

/**
 * Fill expression in AST with target value.
 *
 * @param {TemplateAST} ast
 * @param {{[key: string]: ReactiveModel}} $models
 * @returns {TemplateAST}
 */
function transformAST (ast: TemplateAST, $models: {[key: string]: ReactiveModel}): TemplateAST {
  ast = ast.slice()
  ast.forEach((astNode: ASTNode | string, index: number) => {
    // If is a ASTNode, just go further.
    if (astNode instanceof ASTNode) {
      const transformedChildren = transformAST(astNode.children, $models)
      astNode.children = transformedChildren
      return
    }

    // "astNode" is a string. Means a TextNode.
    const expressions = astNode.match(/{{(\w|\d)+}}|{.+}/g)
    if (expressions) {
      const keysOfModel = Object.keys($models)
      const valuesOfModel = keysOfModel.map(key => $models[key].value)

      expressions.forEach(expression => {
        const pureExpression = expression.replace(/{|}/g, '')  // {{name}} => name
        const model = $models[pureExpression]

        // Calculate value and replace mastache expression.
        const evalFunc = Function.apply(
          null,
          keysOfModel.concat('return ' + pureExpression)
        )
        const result = evalFunc.apply(null, valuesOfModel)

        // Replace mastache expression.
        ast[index] = (<string> ast[index]).replace(expression, result)
      })
    }
  })

  return ast
}
