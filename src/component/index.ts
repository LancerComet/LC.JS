/// <reference path="./index.d.ts" />

import { ReactiveModel } from '../core/model'

/**
 * Create a component.
 *
 * @class Component
 */
class Component {
  /** Model storage. */
  private $models: { [key: string]: ReactiveModel } = {}

  /** Initialize model. */
  private initModels (models: TComponentModels) {
    Object.keys(models).forEach(key => {
      if (!checkVaildKeyName(key)) {
        if (process.env.NODE_ENV === 'development') {
          console.error(
            `[${process.env.NAME}] "${key}" is invaild: A model's name cannot start with "$" or "_".`
          )
        }
        return
      }

      const model = models[key]
      const reactiveModel = new ReactiveModel(key, model)
      this.$models[key] = reactiveModel

      // Set model to root level.
      Object.defineProperty(this, key, {
        enumerable: true,
        get: () => reactiveModel.value,
        set: value => {
          reactiveModel.value = value
        }
      })
    })
  }

  /** Hide the privates. */
  private hidePrivateProps () {
    ['$models'].forEach(key => {
      Object.defineProperty(this, key, {
        configurable: false,
        enumerable: false
      })
    })
  }

  /**
   * Creates an instance of Component.
   * @param {IComponentOption} option
   * @memberof Component
   */
  constructor (option: IComponentOption) {
    this.initModels(option.models)
    this.hidePrivateProps()
  }
}

export {
  Component
}

/**
 * Whether this keyname is vaild.
 *
 * @param {string} keyName
 * @returns {boolean}
 */
function checkVaildKeyName (keyName: string): boolean {
  return keyName.indexOf('$') !== 0 &&
    keyName.indexOf('_') !== 0
}
