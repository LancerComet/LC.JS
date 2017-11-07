/// <reference path="./ast.d.ts" />

import { ASTNodeElement } from './node.element'
import { evaluateExpression } from '../../utils'

class AST {
  /**
   * Whether it should update ReactModels' value of component.
   * This will be set to "true" after this tree has been notified.
   *
   * @private
   * @type {boolean}
   * @memberof AST
   */
  private $updateValue: boolean = false

  $keyCache: string[] = null

  $valueCache: any[] = null

  component: LC

  get element (): Element | Text | Comment {
    // Because only one root element is allowed when create a component,
    // You can get component's element by finding first node in comopnent's AST.
    return this.nodes.length
      ? this.nodes[0].element
      : null
  }

  nodes: ASTNodes

  addNode (node: ASTNodeTypes) {
    this.nodes.indexOf(node) < 0 && this.nodes.push(node)
  }

  evaluateValue (expression: string) {
    const component: LC = this.component

    if (this.$updateValue) {
      const values = this.$keyCache.map(item => component[item])
      this.$valueCache = values
      this.$updateValue = false
    }

    // Evaluate expression and get result.
    const result = evaluateExpression(
      this.$keyCache, this.$valueCache, expression
    )

    return result
  }

  notify (keyName: string, newValue: any) {
    this.$updateValue = true
    this.nodes.forEach(astNode => {
      astNode.update(keyName, newValue)
      if (astNode instanceof ASTNodeElement) {
        astNode.childAST && astNode.childAST.notify(keyName, newValue)
      }
    })
  }

  constructor (component: LC) {
    this.nodes = []
    this.component = component
    this.$keyCache = Object.keys(component) || []
    this.$valueCache = this.$keyCache.map(item => component[item])
  }
}

export {
  AST
}
