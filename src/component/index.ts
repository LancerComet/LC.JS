/// <reference path="./index.d.ts" />

import { ReactiveModel } from '../core/model'

/**
 * LC.JS.
 * class LC is the basic class of a component.
 *
 * @class LC
 */
class LC {
  mount (element: string | Element) {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element
  }
}

/**
 * Component.
 * Create a component by using this decorator.
 *
 * @template T
 * @param {T} ClassCreatedByUser
 * @returns
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
      return
    }

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
        if (!checkVaildKeyName(key)) {
          if (process.env.NODE_ENV === 'development') {
            console.error(
              `[${process.env.NAME}] "${key}" is invaild: A model's name cannot start with "$" or "_".`
            )
          }
          continue
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
      }
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
  Component,
  LC
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
