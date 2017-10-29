declare class ReactiveModel {
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
}
