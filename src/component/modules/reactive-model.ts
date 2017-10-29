/// <reference path="./reactive-models.d.ts" />

/**
 * ReactiveModel is a the class to observe data changing.
 *
 * @class Model
 */
class ReactiveModel {
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
   * Default value backup.
   *
   * @type {*}
   * @memberof ReactiveModel
   */
  defaultValue: any

  /** Value. */
  private _value: any
  get value (): any {
    return this._value
  }
  set value (value) {
    // Imcompatible type.
    if (value.constructor !== this.type) {
      console.error(`[${process.env.NAME}] Model "${this.name}" should be a "${this.type.name}", but a "${value.constructor.name}" is given.`)
      return
    }

    // Correct type.
    this._value = value
  }

  /**
   * Creates an instance of ReactiveModel.
   * @param {string} name
   * @param {IComponentModelItem} modelItem
   * @memberof ReactiveModel
   */
  constructor (name: string, modelItem: IComponentModelItem) {
    // Set name info.
    this.name = name

    // Set type info.
    const type = modelItem.type
    this.type = type

    // Set value data.
    const defaultValue = modelItem.default
    this.defaultValue = type === Array
      ? (<any[]> defaultValue).slice()
      : defaultValue

    this.value = defaultValue
  }
}

export {
  ReactiveModel
}
