/**
 * AST Node.
 * ASTNode is a ViewModel-like object that connects to both code and view.
 *
 * @class ASTNode
 */
declare class ASTNode {
  /**
   * lc-if flag.
   *
   * @type {boolean}
   * @memberof ASTNode
   */
  $if: boolean

  /**
   * Anchor element for lc-if.
   *
   * @type {Comment}
   * @memberof ASTNode
   */
  $ifAnchor: Comment

  /**
   * AST that contains this node.
   *
   * @type {AST}
   * @memberof ASTNode
   */
  ast: AST

  /**
   * ID.
   *
   * @type {string}
   * @memberof ASTNode
   */
  id: string

  /**
   * Attributes of this node.
   *
   * @type {ASTNodeElementAttribute}
   * @memberof ASTNode
   */
  attributes: ASTNodeElementAttribute

  /**
   * Directives reference.
   *
   * @type {Directive[]}
   * @memberof ASTNode
   */
  directives: Directive[]

  /**
   * Element of this node in view.
   *
   * @type {(Element | Text | Comment)}
   * @memberof ASTNode
   */
  element: Element | Text | Comment

  /**
   * ASTNode type.
   *
   * @type {ASTNodeType}
   * @memberof ASTNode
   */
  nodeType: ASTNodeType

  /**
   * Parent ASTNode of this node.
   *
   * @type {ASTNode}
   * @memberof ASTNode
   */
  parentNode: ASTNode

  /**
   * TagName of this node in view.
   *
   * @type {string}
   * @memberof ASTNode
   */
  tagName: string

  /**
   * Find ancesstor for this node.
   *
   * @returns {ASTNode}
   * @memberof ASTNode
   */
  findAncesstor (): ASTNode

  /**
   * Pre-update funciton.
   * If a "true" is given, go continue to update.
   *
   * @param {string} [specificExpression] The expression that is given specifically.
   * @param {*} [newValue] New value for specific expression.
   * @returns {boolean} If do further updates.
   * @memberof ASTNode
   */
  preUpdate (specificExpression?: string, newValue?: any): boolean

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
  update (specificExpression?: string, newValue?: any): void

  /**
   * Creates an instance of ASTNode.
   *
   * @param {IASTNodeOption} param
   * @memberof ASTNode
   */
  constructor (param: IASTNodeOption)
}

/**
 * ASTNode constructor param.
 *
 * @interface IASTNodeOption
 */
interface IASTNodeOption {
  ast: AST
  attributes?: ASTNodeElementAttribute
  parentNode?: ASTNode
  tagName?: string
}

/**
 * Type of ASTNode.
 */
type ASTNodeTypes = ASTNodeComponent | ASTNodeElement | ASTNodeText

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
