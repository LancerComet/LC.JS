/**
 * ReactiveModel is a the class to observe data changing.
 *
 * @class Model
 */
class ReactiveModel {
  /**
   * Name of this reactive model.
   * This value is the keyname of this model in component.
   */
  private _name: string

  /** Model type. */
  private _type: TModelType
  get type (): TModelType {
    return this._type
  }

  /** Default value backup. */
  private _defaultValue: any

  /** Value. */
  private _value: any
  get value (): any {
    return this._value
  }
  set value (value) {
    // Check value type.
    if (value.constructor === this._type) {
      // Correct type,
      this._value = value
    } else {
      // Wrong type, assign default value.
      console.error(`[${process.env.NAME}] Model "${this._name}" should be a "${this._type.name}", but a "${value.constructor.name}" is given.`)
      this._value = this._defaultValue
    }
  }

  /**
   * Creates an instance of ReactiveModel.
   * @param {IComponentModelItem} modelItem
   * @memberof ReactiveModel
   */
  constructor (name: string, modelItem: IComponentModelItem) {
    // Set name info.
    this._name = name

    // Set type info.
    const type = modelItem.type
    this._type = type

    // Set value data.
    const defaultValue = modelItem.default
    this._defaultValue = type === Array
      ? (<any[]> defaultValue).slice()
      : defaultValue

    this.value = defaultValue
  }
}

export {
  ReactiveModel
}
