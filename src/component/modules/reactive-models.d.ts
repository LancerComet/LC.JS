declare class ReactiveModel {
  /**
   * The AST that holds this model.
   *
   * @type {AST}
   * @memberof ReactiveModel
   */
  $ast: AST

  /**
   * Component that uses this ReactiveModel.
   *
   * @type {LC}
   * @memberof ReactiveModel
   */
  $component: LC

  /**
   * Name of this reactive model.
   * This value is the keyname of this model in component.
   *
   * @type {string}
   * @memberof ReactiveModel
   */
  name: string

  /**
   * Model type.
   *
   * @type {TModelType}
   * @memberof ReactiveModel
   */
  type: TModelType

  /**
   * Model value.
   *
   * @type {*}
   * @memberof ReactiveModel
   */
  value: any

  /**
   * Default value is a backup of initial value.
   *
   * @type {*}
   * @memberof ReactiveModel
   */
  defaultValue: any

  /**
   * Creates an instance of ReactiveModel.
   *
   * @param {AST} ast AST that contains this ReactiveModel.
   * @param {string} name Its name.
   * @param {IComponentModelItem} config
   * @memberof ReactiveModel
   */
  constructor (ast: AST, name: string, config: IComponentModelItem)
}
