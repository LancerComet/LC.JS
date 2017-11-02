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
   * Directives in this node.
   *
   * @type {Directive[]}
   * @memberof ASTNode
   */
  directives: Directive[]

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
   * Parent ASTNode.
   *
   * @type {ASTNode}
   * @memberof ASTNode
   */
  parentNode: ASTNode

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
   * Function to update element.
   * If a specific expression is given, update this expression only.
   *
   * @param {LC} component Component object.
   * @param {string} [specificExpression] The expression that is given specifically.
   * @param {*} [newValue] New value for specific expression.
   * @memberof ASTNode
   */
  updateExec: (component: LC, specificExpression?: string, newValue?: any) => void

  /**
   * Set all expressions' value.
   *
   * @param {LC} component
   * @memberof ASTNode
   */
  updateElement: (component: LC) => void
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
  parentNode?: ASTNode
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
