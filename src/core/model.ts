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
    if (type === Array) {
      if (typeof defaultValue !== 'function') {
        throw new TypeError(`[${process.env.NAME}] The default value for an array must be provided with a function that returns a array.`)
      }

      this._defaultValue = <() => any[]> defaultValue()
    } else {
      this._defaultValue = defaultValue
    }

    this.value = this._defaultValue
  }
}

export {
  ReactiveModel
}
