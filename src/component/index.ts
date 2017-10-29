/// <reference path="./index.d.ts" />

import { ReactiveModel } from './modules/reactive-model'

/**
 * Assign this class as a component.
 *
 * @param {IComponentOption} [option={}]
 * @returns
 */
function Component (option: IComponentOption = {}) {
  return function (ClassByUser: any) {
    // Create $template.
    const $template = typeof option.template === 'string'
      ? option.template
      : ''

    // Create $models.
    const $models = {}
    const instance = new ClassByUser()
    const keys = Object.keys(instance)

    // TODO: Check vaild key name.

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

      $models[key] = new ReactiveModel(key, {
        type: value.constructor,
        default: value
      })
    }

    // Inherit.
    ClassByUser.prototype = Object.assign(ClassByUser.prototype, <ILcBaseProperties> {
      $template,
      $models
    })
  }
}

export {
  Component
}
