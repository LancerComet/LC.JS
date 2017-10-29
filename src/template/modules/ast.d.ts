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
  _id: string

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
   * Only available when it's a text node.
   *
   * @type {string}
   * @memberof ASTNode
   */
  textContent: string

  /**
   * If this node is an anchor for component.
   *
   * @type {boolean}
   * @memberof ASTNode
   */
  componentAnchor: boolean

  /**
   * Component constructor.
   * Only available when it is a component anchor.
   *
   * @type {Function}
   * @memberof ASTNode
   */
  ComponentConstructor: new (...args) => any
}

/**
 * AST Node constructor param.
 *
 * @interface IASTNodeOption
 */
interface IASTNodeOption {
  _id: string
  attributes?: ASTNodeElementAttribute
  children?: AST
  componentAnchor?: boolean
  ComponentConstructor?: new (...args) => any
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
 */
type ASTNodeType = number

/**
 * Template elements AST.
 */
type AST = Array<ASTNode>
