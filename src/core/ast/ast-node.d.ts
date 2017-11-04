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
  childAST: AST

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
   * If this node is an anchor for slot,
   *
   * @type {boolean}
   * @memberof ASTNode
   */
  isSlotAnchor: boolean

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
   * Props' name collection.
   * This property will only be available if this is component anchor.
   *
   * @type {ASTNodeProps}
   * @memberof ASTNode
   */
  props: ASTNodeProps

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
   * Update this ASTNode by given expression and new value.
   * Then the element of this ASTNode will be updated.
   * If a specific expression is given, update the element if it contains this expression.
   *
   * @param {LC} component Component object.
   * @param {string} [specificExpression] The expression that is given specifically.
   * @param {*} [newValue] New value for specific expression.
   * @memberof ASTNode
   */
  update: (component: LC, specificExpression?: string, newValue?: any) => void

  /**
   * Creates an instance of ASTNode.
   *
   * @param {IASTNodeOption} params
   * @memberof ASTNode
   */
  constructor (params: IASTNodeOption)
}

/**
 * AST Node constructor param.
 *
 * @interface IASTNodeOption
 */
interface IASTNodeOption {
  attributes?: ASTNodeElementAttribute
  childAST?: AST
  ComponentCtor?: (new () => LC)
  expression: string
  isComponentAnchor?: boolean
  isSlotAnchor?: boolean
  nodeType: ASTNodeType
  parentNode?: ASTNode
  props?: ASTNodeProps
  tagName: string
  textContent?: string
}

/**
 * AST Node Attribute.
 */
type ASTNodeElementAttribute = {[attribute: string]: {
  value: string
  decorators: string[]
}}

/**
 * AST Node type.
 * Same as HTML Node type.
 *  - 1: Element
 *  - 3: TextNode
 *  - 9: Comment
 */
type ASTNodeType = number

/**
 * AST Node props.
 * @example
 *  {
 *    :name: 'login ? myName : '',
 *    :isLogin: 'isLogin'
 *  }
 */
type ASTNodeProps = {[propName: string]: string}
