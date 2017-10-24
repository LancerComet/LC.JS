/**
 * Option for creating a component.
 *
 * @interface IComponentOption
 */
interface IComponentOption {
  models: TComponentModels
}

/**
 * Models in a component.
 */
type TComponentModels = {
  [key: string]: IComponentModelNumber |
    IComponentModelString |
    IComponentModelBoolean |
    IComponentModelArray
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
   * @type {('number' | 'string' | 'boolean' | 'array')}
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
}

/**
 * Number model for component.
 *
 * @interface IComponentModel
 */
interface IComponentModelNumber extends IComponentModelItem {
  type: NumberConstructor
  default: number
}

/**
 * String model for component.
 */
interface IComponentModelString extends IComponentModelItem {
  type: StringConstructor
  default: string
}

/**
 * Boolean model for component.
 */
interface IComponentModelBoolean extends IComponentModelItem {
  type: BooleanConstructor
  default: boolean
}

/**
 * Array model for component.
 */
interface IComponentModelArray extends IComponentModelItem {
  type: ArrayConstructor
  default: () => any[]
}

/**
 * Supported model types.
 */
type TModelType = NumberConstructor | StringConstructor | BooleanConstructor | ArrayConstructor

/**
 * Default value for model.
 */
type TModelDefaultValue = number | string | boolean | Function
