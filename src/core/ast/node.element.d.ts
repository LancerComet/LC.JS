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
