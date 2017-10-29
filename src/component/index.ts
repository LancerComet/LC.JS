/// <reference path="./index.d.ts" />

import { ReactiveModel } from './modules/reactive-model'
import { LC } from '../core'

/**
 * Reserved Properties in component.
 */
const reservedProps = [
  '$models'
]

/**
 * Component.
 * Use this decorator to create a component.
 *
 * @template T
 * @param {T} ClassCreatedByUser
 * @returns {class}
 */
function Component<T extends {new (...args:any[]): any}> (ClassCreatedByUser: T) {
  const instance = new ClassCreatedByUser()

  // Transform property to TComponentModels.
  const keys = Object.keys(instance)
  const models: TComponentModels = {}

  for (let i = 0, length = keys.length; i < length; i++) {
    const key = keys[i]
    const value = instance[key]

    if (value === null || value === undefined) {
      console.error(`[${process.env.NAME}] You should provide an initial value for your model "${key}".`)
      continue
    }

    // Switch value type, method or model.
    // Methods.
    if (typeof value === 'function') {
      // TODO: deal with function.
      continue
    }

    // Model.
    models[key] = {
      type: instance[key].constructor,
      default: instance[key]
    }
  }

  return class Component extends ClassCreatedByUser {
    /** Model storage. */
    private $models: { [key: string]: ReactiveModel } = {}

    /** Initialize model. */
    private initModels (models: TComponentModels) {
      for (let i = 0, length = keys.length; i < length; i++) {
        const key = keys[i]
        // if (!checkVaildKeyName(key)) {
        //   if (process.env.NODE_ENV === 'development') {
        //     console.error(
        //       `[${process.env.NAME}] "${key}" is invaild: A model's name cannot start with "$" or "_".`
        //     )
        //   }
        //   continue
        // }

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
      }
    }

    /** Hide the privates. */
    private hidePrivateProps () {
      reservedProps.forEach(key => {
        Object.defineProperty(this, key, {
          configurable: false,
          enumerable: false
        })
      })
    }

    /**
     * Creates an instance of Component.
     * @memberof Component
     */
    constructor (...args) {
      super(...args)
      this.hidePrivateProps()
      this.initModels(models)
    }
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
