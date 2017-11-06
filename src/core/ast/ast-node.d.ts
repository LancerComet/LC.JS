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
   * @returns {{component: LC, variables: string[], values: any[]}}  Necessary data for further updates.
   * @memberof ASTNode
   */
  preUpdate (specificExpression?: string, newValue?: any): {
    component: LC, variables: string[], values: any[]
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
 * Class that represets a Component-type-ASTNode.
 *
 * @class ASTNodeComponent
 * @extends {ASTNode}
 */
declare class ASTNodeComponent extends ASTNode {
  /**
   * Component constructor.
   *
   * @type {ComponentClass}
   * @memberof ASTNodeComponent
   */
  ComponentCtor: ComponentClass

  /**
   * Component instance reference.
   *
   * @type {LC}
   * @memberof ASTNodeComponent
   */
  componentInstance: LC

  /**
   * Node type.
   *
   * @type {ASTNodeType}
   * @memberof ASTNodeComponent
   */
  nodeType: ASTNodeType

  /**
   * Props.
   *
   * @type {ASTNodeProps}
   * @memberof ASTNodeComponent
   */
  props: ASTNodeProps

  /**
   * Mount target component.
   *
   * @memberof ASTNodeComponent
   */
  mountComponent (): void

  /**
   * Unmuont target component.
   *
   * @memberof ASTNodeComponent
   */
  unMountComponent (): void

  /**
   * Update node by using new value.
   *
   * @param {string} [specificExpression]
   * @param {*} [newValue]
   * @memberof ASTNodeComponent
   */
  update (specificExpression?: string, newValue?: any): void

  constructor (param: IASTNodeComponent)
}

/**
 * ASTNodeComponent constructor param.
 *
 * @interface IASTNodeComponent
 * @extends {IASTNodeOption}
 */
interface IASTNodeComponent extends IASTNodeOption {
  ComponentCtor?: ComponentClass
  componentInstance?: LC
  props?: ASTNodeProps
}

/**
 * Class that represets a Element-type-ASTNode.
 *
 * @class ASTNodeElement
 * @extends {ASTNode}
 */
declare class ASTNodeElement extends ASTNode {
  /**
   * Child AST.
   *
   * @type {AST}
   * @memberof ASTNodeElement
   */
  childAST: AST

  /**
   * Node type.
   *
   * @type {ASTNodeType}
   * @memberof ASTNodeElement
   */
  nodeType: ASTNodeType

  /**
   * Update node by using new value.
   *
   * @param {string} [specificExpression]
   * @param {*} [newValue]
   * @memberof ASTNodeComponent
   */
  update (specificExpression?: string, newValue?: any): void

  /**
   * Creates an instance of ASTNodeElement.
   *
   * @param {IASTNodeElementOption} param
   * @memberof ASTNodeElement
   */
  constructor (param: IASTNodeElementOption)
}

/**
 * ASTNodeElement constructor param.
 *
 * @interface IASTNodeElementOption
 * @extends {IASTNodeOption}
 */
interface IASTNodeElementOption extends IASTNodeOption {
  childAST?: AST
}

/**
 * Class that represets a Text-type-ASTNode.
 *
 * @class ASTNodeText
 * @extends {ASTNode}
 */
declare class ASTNodeText extends ASTNode {
  /**
   * Expression.
   *
   * @type {string}
   * @memberof ASTNodeText
   */
  expression: string

  /**
   * Node type.
   *
   * @type {ASTNodeType}
   * @memberof ASTNodeText
   */
  nodeType: ASTNodeType

  /**
   * Text content for this node.
   * This prop will be written into element.
   *
   * @type {string}
   * @memberof ASTNodeText
   */
  textContent: string

  /**
   * Update node with new value given.
   *
   * @param {string} [specificExpression]
   * @param {*} [newValue]
   * @memberof ASTNodeText
   */
  update (specificExpression?: string, newValue?: any): void

  /**
   * Creates an instance of ASTNodeText.
   *
   * @param {IASTNodeTextOption} param
   * @memberof ASTNodeText
   */
  constructor (param: IASTNodeTextOption)
}

/**
 * ASTNodeText constructor param.
 *
 * @interface IASTNodeTextOption
 * @extends {IASTNodeOption}
 */
interface IASTNodeTextOption extends IASTNodeOption {
  expression?: string
  textContent?: string
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
