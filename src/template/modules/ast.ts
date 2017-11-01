/// <reference path="./ast.d.ts" />

import { DIRECTIVE, NODE_TYPE } from '../../core/config'
import { internalDirectives, isDirective, isEventDirective, isValueDirective } from '../../directives'
import { nextTick, randomID } from '../../utils'

/**
 * AST Node.
 *
 * @class ASTNode
 */
class ASTNode {
  id: string
  attributes: ASTNodeElementAttribute
  children: AST
  ComponentCtor: (new () => LC)
  directives: Directive[]
  element: Element | Text | Comment
  expression: string
  isComponentAnchor: boolean
  nodeType: ASTNodeType
  parentNode: ASTNode
  tagName: string
  textContent: string

  /**
   * Create HTML element.
   *
   * @memberof ASTNode
   */
  createElement () {
    let element: Element | Text | Comment = null

    switch (this.nodeType) {
      // Component anchor or html element.
      case NODE_TYPE.element:
        element = document.createElement(this.tagName)

        // Add data-style for style scoping.
        // Use parent's id if it has a parent.
        element.setAttribute('data-style-' + getAncestorID(this), '')

        // Set attributes.
        const attributes = Object.keys(this.attributes)
        for (let i = 0, length = attributes.length; i < length; i++) {
          let attrName = attributes[i]
          const attrValue = this.attributes[attrName]

          // If this attribute is a directive.
          if (isDirective(attrName)) {
            // Event directive.
            if (isEventDirective(attrName)) {
              // TODO: ....
              continue
            }

            // Value directive.
            if (isValueDirective(attrName)) {
              const InternalDirectiveCtor = internalDirectives.value[attrName]

              // An internal directive is detected.
              // Create a directive object and let it to do all jobs
              // such as compiling, updating, etc.
              if (InternalDirectiveCtor) {
                const directive = new InternalDirectiveCtor(this, element, attrValue)
                nextTick(() => directive.install())
                this.directives.push(directive)
                continue

              // A non-internal directive, just normalize it to a standard html attribute
              // and set its value.
              } else {
                attrName = attrName.replace(DIRECTIVE.flags.value, '')
              }
            }
          }

          element.setAttribute(attrName, attrValue)
        }

        break

      // TextNode.
      case NODE_TYPE.textNode:
        element = document.createTextNode(this.textContent)
        break

      // Comment.
      // This might be a component anchor.
      case NODE_TYPE.comment:
        element = document.createComment('')
        break
    }

    this.element = element
  }

  /**
   * Function to update element.
   * If a specific expression is given, update this expression only.
   *
   * @param {$ComponentModels} $models All models in component.
   * @param {string} [specificExpression] The expression that is given specifically.
   * @param {*} [newValue] New value for specific expression.
   * @memberof ASTNode
   */
  updateExec ($models: $ComponentModels, specificExpression?: string, newValue?: any) {
    const expressions = matchExpression(this.expression)

    // No expression, go return.
    if (!expressions) {
      return
    }

    // If specific expression is given, check if "expressions" contains this one.
    let doUpdate = false
    if (specificExpression) {
      const pureExpressions = expressions.map(getPureExpression)
      pureExpressions.some(item => {
        if (item.match(new RegExp(specificExpression))) {
          doUpdate = true
          return doUpdate
        }
      })
    } else {
      doUpdate = true
    }

    if (!doUpdate) {
      return
    }

    const variables = Object.keys($models)
    const values = variables.map(item => $models[item].value)

    switch (this.nodeType) {
      // Element only needs to update all directives.
      case NODE_TYPE.element:
        // Update all directives.
        this.directives.forEach(directive => {
          let attrValue = directive.expression  // font-size: {{size}}px
                                                // Will be replaced with final value.
          const expInThisAttrValue = matchExpression(attrValue) // [{{size}}]

          expInThisAttrValue && expInThisAttrValue.forEach(exp => {
            attrValue = attrValue.replace(
              exp,
              evaluateExpression(variables, values, getPureExpression(exp))
            )
          })

          directive.update(attrValue)
        })

        break

      // TextNode needs to update textContent.
      case NODE_TYPE.textNode:
        let newTextContent = this.expression

        expressions.forEach(exp => {
          // Replace mastache expression.
          newTextContent = newTextContent.replace(
            exp,
            evaluateExpression(variables, values, getPureExpression(exp))
          )
        })

        nextTick(() => {
          this.textContent = newTextContent
          this.element.textContent = newTextContent
        })

        break
    }
  }

  /**
   * Set all expressions' value.
   *
   * @param {$ComponentModels} $models
   * @memberof ASTNode
   */
  updateElement ($models: $ComponentModels) {
    this.updateExec($models)

    // Update children too.
    this.children.forEach(child => child.updateElement($models))
  }

  constructor (params: IASTNodeOption) {
    this.id = randomID()
    this.attributes = params.attributes || {}
    this.directives = []
    this.children = params.children || []
    this.expression = params.expression.trim() || ''
    this.isComponentAnchor = !!params.isComponentAnchor
    this.parentNode = params.parentNode
    this.nodeType = params.nodeType || NODE_TYPE.element
    this.tagName = params.tagName

    switch (params.nodeType) {
      case NODE_TYPE.textNode:
        this.textContent = params.textContent || ''
        this.tagName = ''  // Over tagName to empty.
        break

      case NODE_TYPE.element:
        break

      case NODE_TYPE.comment:
        this.ComponentCtor = params.ComponentCtor || null
        break
    }

    this.createElement()
  }
}

export {
  ASTNode
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
    variableName.concat('return typeof ' + expression + ' === "undefined" ? "" : ' + expression)
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

/**
 * Normalize operators for regexp.
 *
 * @param {string} regExpStr
 * @returns {string}
 * @example
 *  {{a * b}} => {{a \* b}}
 */
function normalizeOperators (regExpStr: string) {
  (regExpStr.match(/\+|\*/g) || []).forEach(item => {
    regExpStr = regExpStr.replace(item, '\\' + item)
  })

  return regExpStr
}

/**
 * Get ancestor's ID.
 *
 * @param {ASTNode} astNode
 * @returns
 */
function getAncestorID (astNode: ASTNode) {
  return astNode.parentNode
    ? getAncestorID(astNode.parentNode)
    : astNode.id
}
