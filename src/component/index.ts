/// <reference path="./index.d.ts" />

import { ReactiveModel } from './modules/reactive-model'

/**
 * Assign this class as a component.
 *
 * @param {IComponentOption} [option]
 * @returns
 */
function Component (component: ComponentClass)
function Component (option: IComponentOption)
function Component (optionOrCtor: ComponentClass | IComponentOption) {
  return function (ClassByUser: ComponentClass) {
    let $template: string = ''
    let $components: $ComponentUsage = {}

    // Override ClassByUser if param is the class.
    if (typeof optionOrCtor === 'function') {
      ClassByUser = <ComponentClass> optionOrCtor

    // IComponentOption.
    } else {
      const option = <IComponentOption> optionOrCtor

      // Create $components.
      if (typeof option.components === 'object') {
        const componentNames = Object.keys(option.components)
        for (let i = 0, length = componentNames.length; i < length; i++) {
          const compName = componentNames[i]
          $components[compName] = {
            reference: [],
            Constructor: <ComponentClass> option.components[compName]
          }
        }
      }

      // Create $template.
      $template = typeof option.template === 'string'
        ? option.template
        : ''
    }

    // Create $models.
    const $models: $ComponentModels = {}
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
      value: Object.assign(ClassByUser.prototype, {
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
