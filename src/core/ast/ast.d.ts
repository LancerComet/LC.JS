/**
 * AST.
 * AST is a data structure that contains branch of ASTNodes.
 * An ASTNode represenets a HTML element in view, and a ViewModel in code.
 *
 * @class AST
 */
declare class AST {
  /**
   * Key cache of Reactive Models.
   * This is designed for expression evalutation.
   *
   * @type {string[]}
   * @memberof AST
   */
  $keyCache: string[]

  /**
   * Value cache of Reactive Models.
   * This is designed for expression evalutation.
   *
   * @type {any[]}
   * @memberof AST
   */
  $valueCache: any[]

  /**
   * Component that uses this AST.
   *
   * @type {LC}
   * @memberof AST
   */
  component: LC

  /**
   * Get element of this AST.
   * This will be the element for the component of this AST.
   *
   * @type {HTMLElement}
   * @memberof AST
   */
  element: Element | Text | Comment

  /**
   * Evaluate target expression and get result from this AST.
   *
   * @param {string} expression
   * @memberof AST
   */
  evaluateValue (expression: string)

  /**
   * ASTNodes in this AST.
   *
   * @type {ASTNodes}
   * @memberof AST
   */
  nodes: ASTNodes

  /**
   * Add an ASTNode to this AST.
   *
   * @param {ASTNodeTypes} node
   * @memberof AST
   */
  addNode (node: ASTNodeTypes): void

  /**
   * Notify all ASTNodes to update their value with new one.
   *
   * @param {string} keyName
   * @param {*} newValue
   * @memberof AST
   */
  notify (keyName: string, newValue: any): void

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
type ASTNodes = ASTNodeTypes[]
