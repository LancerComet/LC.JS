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
    onInstalled (astNode, element) {
    },
    onUpdated (astNode, element) {
    },
    onUninstalled (astNode, element) {
    }
  })
}

const value = {
  [valueFlag + 'class']: createDirectiveConstructor({
    name: valueFlag + 'class',
    onInstalled (astNode, element) {
    },
    onUpdated (astNode, element) {
    },
    onUninstalled (astNode, element) {
    }
  }),

  [valueFlag + 'style']: createDirectiveConstructor({
    name: valueFlag + 'style',
    onInstalled (astNode, element) {
      console.log('style installed: ', element.attributes)
    },
    onUpdated (astNode, element) {
    },
    onUninstalled (astNode, element) {
    }
  }),
}

export {
  event,
  value
}
