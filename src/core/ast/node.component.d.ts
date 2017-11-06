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
