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
    // Create $components.
    const $components: $ComponentUsage = {}
    if (option.components) {
      Object.keys(option.components).forEach(key => {
        $components[key] = {
          reference: [],
          Constructor: <new () => LC> option.components[key]
        }
      })
    }

    // Create $template.
    const $template = typeof option.template === 'string'
      ? option.template
      : ''

    // Create $models.
    const $models = {}
    const instance = new ClassByUser()

    const instanceKeys = Object.keys(instance)  // Value properties and user-defined methods from prototype.
    const methodKeys = Object.getOwnPropertyNames(ClassByUser.prototype)
      .filter(item => item !== 'constructor')

    const keys = instanceKeys.concat(methodKeys)

    for (let i = 0, length = keys.length; i < length; i++) {
      const key = keys[i]

      // Check key name.
      if (!checkAvailableKeyName(key)) {
        if (process.env.NODE_ENV === 'development') {
          console.error(
            `[${process.env.NAME}] Invaild keyname "${key}", please do not use a key that starts with "_" or "$".`
          )
        }
        continue
      }

      const value = instance[key]

      if (value === null || value === undefined) {
        console.error(
          `[${process.env.NAME}] You should provide an initial value for your model "${key}".`
        )
        continue
      }

      // Create reactive model.
      $models[key] = new ReactiveModel(key, {
        type: value.constructor,
        default: value,
        $component: null  // Will be written in class LC.
      })
    }

    // Rewrite prototype for inheritance.
    Object.defineProperty(ClassByUser, 'prototype', {
      value: Object.assign(ClassByUser.prototype, <ILcBaseProperties> {
        $components,
        $template,
        $models
      })
    })
  }
}

export {
  Component
}

/**
 * Check available key name.
 *
 * @param {string} keyName
 * @returns {boolean}
 */
function checkAvailableKeyName (keyName: string): boolean {
  return !/(_|\$).+/.test(keyName)
}
