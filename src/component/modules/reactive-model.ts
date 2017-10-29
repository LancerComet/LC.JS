/// <reference path="./reactive-models.d.ts" />

/**
 * ReactiveModel is a the class to observe data changing.
 *
 * @class Model
 */
class ReactiveModel {
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
  set value (newValue) {
    // Imcompatible type.
    if (newValue.constructor !== this.type) {
      console.error(`[${process.env.NAME}] Model "${this.name}" should be a "${this.type.name}", but a "${newValue.constructor.name}" is given.`)
      return
    }

    const oldValue = this._value
    if (oldValue === newValue) {
      return
    }

    this._value = newValue

    // Notify component.
    this.$component && this.$component['$notify'](
      this.name,
      newValue,
      oldValue
    )
  }

  /**
   * Creates an instance of ReactiveModel.
   * @param {string} name
   * @param {IComponentModelItem} modelItem
   * @memberof ReactiveModel
   */
  constructor (name: string, modelItem: IComponentModelItem) {
    // Keep component reference.
    if (modelItem.$component) {
      this.$component = modelItem.$component
    }

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
