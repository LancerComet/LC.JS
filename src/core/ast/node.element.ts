/// <reference path="./node.element.d.ts" />

import { ASTNode } from './node.base'
import { NodeType } from '../config'
import { isDirective, createDirective, directives } from '../../directives'
import { evaluateExpression, nextTick } from '../../utils'

class ASTNodeElement extends ASTNode {
  childAST: AST
  nodeType: ASTNodeType = NodeType.element

  private createElement () {
    const element: Element = document.createElement(this.tagName)

    // Add data-style for style scoping.
    // Use parent's id if it has a parent.
    const styleAttr = 'data-style-' + this.findAncesstor().id
    element.setAttribute(styleAttr, '')

    // Set attributes.
    const attrNames = Object.keys(this.attributes)
    for (let i = 0, length = attrNames.length; i < length; i++) {
      const attrName = attrNames[i]
      const { value: attrValue } = this.attributes[attrName]

      // If this attribute is a directive.
      if (isDirective(attrName)) {
        // Get Directive Constructor if this directive has been defined.
        let DirectiveCtor = directives[attrName]

        // A non-internal directive, create a directive for this one.
        if (!DirectiveCtor) {
          DirectiveCtor = createDirective({
            name: attrName
          })
        }

        // Create a directive object and let it to do all jobs such as compiling, updating, etc.
        const directive = new DirectiveCtor(this, element, attrValue)
        nextTick(() => directive.install())
        this.directives.push(directive)
        continue
      }

      // A normal html attribute.
      element.setAttribute(attrName, attrValue)
    }

    this.element = element
  }

  update (specificExpression?: string, newValue?: any) {
    const dataObj = super.preUpdate(specificExpression, newValue)
    if (!dataObj) { return }

    const { variables, values, component } = dataObj

    // Element only needs to update all directives.
    for (let i = 0, length = this.directives.length; i < length; i++) {
      const directive = this.directives[i]
      const expression = directive.expression  // 'font-size:' +  size + 'px'

      if (
        specificExpression &&
        !checkIfHasTargetExpression(expression, specificExpression)
      ) {
        continue
      }

      const value = typeof newValue !== 'undefined'
        ? newValue
        : evaluateExpression(variables, values, expression)

      directive.update(value, component)
    }
  }

  constructor (param: IASTNodeElementOption) {
    super(param)
    this.childAST = param.childAST
    this.createElement()
  }
}

export {
  ASTNodeElement
}

/**
 * Check if specificExpression is in wholeExpression.
 *
 * @param {string} wholeExpression
 * @param {string} specificExpression
 * @returns {boolean}
 */
function checkIfHasTargetExpression (wholeExpression: string, specificExpression: string): boolean {
  return !!wholeExpression.match(new RegExp('\\b' + specificExpression + '\\b'))
}
