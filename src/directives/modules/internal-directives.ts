/**
 * Internal directives module.
 * This module presets all internal directives' constructor.
 */

import { DIRECTIVE } from '../../core/config'
import { createDirectiveConstructor } from './directive'

const eventFlag = DIRECTIVE.flags.event
const valueFlag = DIRECTIVE.flags.value

const event = {
  [eventFlag + 'click']: createDirectiveConstructor({
    name: eventFlag + 'click',
    onInstalled (element) {
    },
    onUpdated (element) {
    },
    onUninstalled (element) {
    }
  })
}

const value = {
  [valueFlag + 'class']: createDirectiveConstructor({
    name: valueFlag + 'class',
    onInstalled (element) {
    },
    onUpdated (element) {
    },
    onUninstalled (element) {
    }
  }),

  [valueFlag + 'style']: createDirectiveConstructor({
    name: valueFlag + 'style',
    onInstalled (element) {
    },
    onUpdated (element) {
    },
    onUninstalled (element) {
    }
  }),
}

export {
  event,
  value
}
