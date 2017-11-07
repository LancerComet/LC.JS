/// <reference path="./reactive-models.d.ts" />

/**
 * ReactiveModel is a the class to observe data changing.
 *
 * @class Model
 */
class ReactiveModel {
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
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[${process.env.NAME}] Model "${this.name}" should be a "${this.type.name}", but a "${newValue.constructor.name}" is given:`, newValue)
      }
      // return
    }

    const oldValue = this._value
    if (oldValue === newValue) {
      return
    }

    this._value = newValue

    // Tell its AST that some value has been updated.
    const name = this.name
    this.$ast && this.$ast.notify(name, newValue)
  }

  /**
   * Creates an instance of ReactiveModel.
   *
   * @param {AST} ast
   * @param {string} name
   * @param {IComponentModelItem} config
   * @memberof ReactiveModel
   */
  constructor (ast: AST, name: string, config: IComponentModelItem) {
    // Keep component reference.
    if (config.$component) {
      this.$component = config.$component
    }

    // Set AST.
    this.$ast = ast

    // Set name info.
    this.name = name

    // Set type info.
    const type = config.type
    this.type = type

    // Set value data.
    const defaultValue = config.default
    this.defaultValue = type === Array
      ? (<any[]> defaultValue).slice()
      : defaultValue

    this.value = defaultValue
  }
}

export {
  ReactiveModel
}
