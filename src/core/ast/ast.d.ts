declare class AST {
  nodes: ASTNodes

  /**
   * Add an ASTNode to this AST.
   *
   * @param {ASTNode} node
   * @memberof AST
   */
  addNode (node: ASTNode): void

  /**
   * Notify all ASTNodes to update their value with new one.
   *
   * @param {LC} component
   * @param {string} keyName
   * @param {*} newValue
   * @memberof AST
   */
  notify (component: LC, keyName: string, newValue: any): void

  /**
   * Update all ASTNodes.
   *
   * @param {LC} component
   * @param {string} [specificExpression]
   * @param {*} [newValue]
   * @memberof AST
   */
  updateNodes (component: LC, specificExpression?: string, newValue?: any): void

  /**
   * Creates an instance of AST.
   *
   * @param {ASTNodes} [nodes]
   * @memberof AST
   */
  constructor (nodes?: ASTNodes)
}

/**
 * Nodes in AST,
 */
type ASTNodes = ASTNode[]
