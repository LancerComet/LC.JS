/**
 * Option for component.
 *
 * @interface IComponentOption
 */
interface IComponentOption {
  components?: {[name: string]: Function}
  template?: string
}

/**
 * Model item in a component.
 *
 * @interface IComponentModel
 */
interface IComponentModelItem {
  /**
   * Model type.
   *
   * @type {TModelType}
   * @memberof IComponentModel
   */
  type: TModelType

  /**
   * Default / initial value of this item.
   * And this will be a fallback value if a wrong type value is given.
   *
   * @type {TModelDefaultValue}
   * @memberof IComponentModel
   */
  default: TModelDefaultValue

  /**
   * Component which uses this ReactiveModel.
   *
   * @type {LC}
   * @memberof IComponentModelItem
   */
  $component?: LC
}

/**
 * Supported model types.
 */
type TModelType = NumberConstructor | StringConstructor | BooleanConstructor | FunctionConstructor | ArrayConstructor

/**
 * Default value for model.
 */
type TModelDefaultValue = number | string | boolean | Function | any[]

/**
 * Component class type.
 * The class that is created by user.
 */
type ComponentClass = typeof LC
