/**
 * AST Node.
 *
 * @class ASTNode
 */
declare class ASTNode {
  /**
   * ID.
   *
   * @type {string}
   * @memberof ASTNode
   */
  id: string

  /**
   * HTML Attributes.
   *
   * @type {ASTNodeElementAttribute}
   * @memberof ASTNode
   */
  attributes: ASTNodeElementAttribute

  /**
   * Children in this node.
   *
   * @type {AST}
   * @memberof ASTNode
   */
  children: AST

  /**
   * Componnet Constructor.
   * Only available if this node is a component anchor.
   *
   * @type {Function}
   * @memberof ASTNode
   */
  ComponentCtor: (new () => LC)

  /**
   * Element that refers to this ASTNode.
   *
   * @type {(Element | Text)}
   * @memberof ASTNode
   */
  element: Element | Text | Comment

  /**
   * Expression of this ASTNode.
   * Only available when it's a text node.
   *
   * @type {string}
   * @memberof ASTNode
   * @example
   *   My name is {{name}} and I'm {{age}}-year-old.
   */
  expression: string

  /**
   * If this node is an anchor for component.
   *
   * @type {boolean}
   * @memberof ASTNode
   */
  isComponentAnchor: boolean

  /**
   * Node type.
   *
   * @type {ASTNodeType}
   * @memberof ASTNode
   */
  nodeType: ASTNodeType

  /**
   * TagName.
   *
   * @type {string}
   * @memberof ASTNode
   */
  tagName: string

  /**
   * TextContent.
   * Transformed from "this.expression" by giving values.
   * Only available when it's a text node.
   *
   * @type {string}
   * @memberof ASTNode
   */
  textContent: string

  /**
   * Create HTML element.
   *
   * @memberof ASTNode
   */
  createElement: () => void

  /**
   * Set single expression value.
   *
   * @param {$ComponentModels} $models All models in component.
   * @param {string} [specificExpression] The expression that is given specifically.
   * @param {*} [newValue] New value for specific expression.
   * @memberof ASTNode
   */
  setSingleExpressionValue: ($models: $ComponentModels, specificExpression?: string, newValue?: any) => void

  /**
   * Set all expressions' value.
   *
   * @param {$ComponentModels} $models
   * @memberof ASTNode
   */
  updateElement: ($models: $ComponentModels) => void
}

/**
 * AST Node constructor param.
 *
 * @interface IASTNodeOption
 */
interface IASTNodeOption {
  attributes?: ASTNodeElementAttribute
  children?: AST
  ComponentCtor?: (new () => LC)
  expression: string
  isComponentAnchor?: boolean
  nodeType: ASTNodeType
  tagName: string
  textContent?: string
}

/**
 * AST Node Attribute.
 */
type ASTNodeElementAttribute = {[attribute: string]: string}

/**
 * AST Node type.
 * Same as HTML Node type.
 *  - 1: Element
 *  - 3: TextNode
 *  - 9: Comment
 */
type ASTNodeType = number

/**
 * Template elements AST.
 */
type AST = Array<ASTNode>
