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
