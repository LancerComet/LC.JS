import { DirectiveConfig } from '../../core/config'
import { createDirective } from '../modules/directive'

function initSlot (directiveStore: {[directiveName: string]: typeof Directive}) {
  const DIRECTIVE_NAME = `${DirectiveConfig.flags.internal}slot`

  const Slot = createDirective({
    name: DIRECTIVE_NAME,
    isCustom: true,

    onInstall (directive: Directive) {
    },

    onInstalled (directive: Directive, newValue: any, component: LC) {
    },

    onUpdated (directive: Directive, newValue: any, component: LC) {
    }
  })

  directiveStore[DIRECTIVE_NAME] = Slot
}

export {
  initSlot
}
