/// <reference path="./ast-node.d.ts" />

import { DirectiveConfig, NodeType } from '../config'
import { createDirective, directives, isDirective } from '../../directives'
import { matchExpression, nextTick, randomID } from '../../utils'

class ASTNode {
  $if: boolean
  ast: AST
  id: string
  attributes: ASTNodeElementAttribute
  directives: Directive[]
  element: Element | Text | Comment
  nodeType: ASTNodeType
  parentNode: ASTNode
  tagName: string

  /**
   * Find ancesstor for this node.
   *
   * @returns {ASTNode}
   * @memberof ASTNode
   */
  findAncesstor (): ASTNode {
    return this.parentNode
      ? this.parentNode.findAncesstor()
      : this
  }

  /**
   * Pre-update funciton.
   * If a "true" is given, go continue to update.
   *
   * @param {string} [specificExpression] The expression that is given specifically.
   * @param {*} [newValue] New value for specific expression.
   * @returns {{component: LC, variables: string[], values: any[]}}  Necessary data for further updates.
   * @memberof ASTNode
   */
  preUpdate (specificExpression?: string, newValue?: any): {
    component: LC, variables: string[], values: any[]
  } {
    const component: LC = this.ast.component
    const variables = Object.keys(component)
    const values = variables.map(item => component[item])

    // Deal with internal directives first.
    // lc-if.
    // TODO: Optimise processing.
    const ifFlag = this.attributes[DirectiveConfig.flags.internal + 'if']

    if (ifFlag) {
      const controlExpValue = !!evaluateExpression(variables, values, ifFlag.value)  // true or false.
      if (!controlExpValue) {
        this.$if = false

        // If this node isn't Component Node, don't go update further.
        if (this.nodeType !== NodeType.comment) {
          return null
        }
      } else if (controlExpValue && !this.$if) {
        this.$if = true
      }
    }

    return {
      component, variables, values
    }
  }

  /**
   * Update this ASTNode by given expression and new value.
   * Then the element of this ASTNode will be updated.
   * If a specific expression is given, update the element if it contains this expression.
   *
   * @param {string} [specificExpression] The expression that is given specifically.
   * @param {*} [newValue] New value for specific expression.
   * @return {boolean} Tell child class if go continue.
   * @memberof ASTNode
   */
  update (specificExpression?: string, newValue?: any) {}

  /**
   * Creates an instance of ASTNode.
   *
   * @param {IASTNodeOption} param
   * @memberof ASTNode
   */
  constructor (param: IASTNodeOption) {
    // Param checking only in lib development.
    if (process.env.LIB_IN_DEV) {
      if (!param.ast) {
        console.error(`[${process.env.NAME}] No AST is given when creating an ASTNode.`, param)
        return
      }

      if (!param.tagName) {
        console.error(`[${process.env.NAME}] No tagName is given when creating an ASTNode.`, param)
        return
      }
    }

    this.$if = true
    this.id = randomID()
    this.ast = param.ast
    this.attributes = param.attributes || {}
    this.directives = []
    this.parentNode = param.parentNode
    this.tagName = param.tagName || ''
  }
}

class ASTNodeComponent extends ASTNode {
  ComponentCtor: ComponentClass
  componentInstance: LC
  nodeType = NodeType.comment
  props: ASTNodeProps

  /**
   * Create element for Component Node.
   *
   * @private
   * @memberof ASTNodeComponent
   */
  private createElement () {
    const element: Comment = document.createComment(this.id)
    this.element = element
  }

  /**
   * Mount target component.
   *
   * @memberof ASTNodeComponent
   */
  mountComponent () {
    const compInstance = this.componentInstance

    if (!this.$if || !compInstance) {
      return
    }

    // Access to component's element.
    // Because only one root element is allowed when create a component,
    // You can get component's element by finding first node in comopnent's AST.
    const componentElements = (<AST> compInstance['$ast']).element
    if (!componentElements) {
      return
    }

    // Mount elements.
    nextTick(() => {
      const element = this.element
      const parent = element.parentElement
      if (!parent) { return }
      parent.insertBefore(componentElements, element)
      parent.removeChild(element)
      typeof compInstance.mounted === 'function' &&
        compInstance.mounted()
    })
  }

  /**
   * Unmuont target component.
   *
   * @memberof ASTNodeComponent
   */
  unMountComponent () {
    const compInstance = this.componentInstance

    if (!compInstance) {
      return
    }

    const componentElements = (<AST> compInstance['$ast']).element
    if (!componentElements) {
      return
    }

    const parent = componentElements.parentElement

    // If no parent element, component must be never-mounted.
    if (!parent) {
      return
    }

    nextTick(() => {
      parent.insertBefore(this.element, componentElements)
      parent.removeChild(componentElements)
    })
  }

  /**
   * Update node by using new value.
   *
   * @param {string} [specificExpression]
   * @param {*} [newValue]
   * @memberof ASTNodeComponent
   */
  update (specificExpression?: string, newValue?: any) {
    const goContinue = super.preUpdate(specificExpression, newValue)
    if (!goContinue) { return }

    // Component node only need to check mounting status.
    this.$if
      ? this.mountComponent()
      : this.unMountComponent()
  }

  constructor (param: IASTNodeComponent) {
    super(param)
    this.ComponentCtor = param.ComponentCtor
    this.componentInstance = param.componentInstance
    this.props = param.props || {}
    this.createElement()
  }
}

class ASTNodeElement extends ASTNode {
  childAST: AST
  nodeType: ASTNodeType = NodeType.element

  /**
   * Create element for ASTNodeElement.
   *
   * @private
   * @memberof ASTNodeElement
   */
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

  /**
   * Update node by using new value.
   *
   * @param {string} [specificExpression]
   * @param {*} [newValue]
   * @memberof ASTNodeComponent
   */
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

/**
 * Class that represets a Text-type-ASTNode.
 *
 * @class ASTNodeText
 * @extends {ASTNode}
 */
class ASTNodeText extends ASTNode {
  expression: string
  nodeType: ASTNodeType = NodeType.textNode
  textContent: string

  /**
   * Create element for ASTNodeText.
   *
   * @private
   * @memberof ASTNodeText
   */
  private createElement () {
    const element = document.createTextNode(this.textContent)
    this.element = element
  }

  update (specificExpression?: string, newValue?: any) {
    const resultObj = super.preUpdate(specificExpression, newValue)
    if (!resultObj) { return }

    const { variables, values } = resultObj

    // TextNode is going to update textContent.
    const expressions = matchExpression(this.expression)

    // No expression, go return.
    if (!expressions) {
      return
    }

    const pureExpressions = expressions.map(getPureExpression)

    // If specific expression is given, check if "expressions" contains this one.
    let doUpdate = false
    if (specificExpression) {
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

    let newTextContent = this.expression

    expressions.forEach((exp, index) => {
      // If specific expression and vaule is given, override newValue to original value.
      if (exp.indexOf(specificExpression) > -1 && typeof newValue !== 'undefined') {
        const expIndex = variables.indexOf(specificExpression)
        if (expIndex > -1) {
          values[expIndex] = newValue
        }
      }

      // Replace mastache expression.
      const pureExpression = pureExpressions[index]
      newTextContent = newTextContent.replace(
        exp,
        evaluateExpression(variables, values, pureExpression)  // Evaluate new value.
      )
    })

    nextTick(() => {
      this.textContent = newTextContent
      this.element.textContent = newTextContent
    })
  }

  constructor (param: IASTNodeTextOption) {
    super(param)
    this.expression = param.expression || ''
    this.textContent = param.textContent || ''
    this.createElement()
  }
}

export {
  ASTNode,
  ASTNodeComponent,
  ASTNodeElement,
  ASTNodeText
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
    variableName.concat('try { return ' + expression + '} catch (error) { return "" }')
  )
  const result = evalFunc.apply(null, variableValue)
  return result
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

/**
 * Get pure expression by removing mastache.
 *
 * @param {string} expression
 * @returns {string}
 */
function getPureExpression (expression: string): string {
  return expression.replace(/{|}/g, '')
}
