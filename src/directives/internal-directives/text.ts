import { DirectiveConfig } from '../../core/config'
import { createDirective } from '../modules/directive'

function initText (directiveStore: {[directiveName: string]: typeof Directive}) {
  const DIRECTIVE_NAME = `${DirectiveConfig.flags.internal}text`

  const Text = createDirective({
    name: DIRECTIVE_NAME,
    isCustom: true,

    onInstall (directive: Directive) {
    },

    onInstalled (directive: Directive, newValue: any, component: LC) {
    },

    onUpdated (directive: Directive, newValue: any, component: LC) {
    }
  })

  directiveStore[DIRECTIVE_NAME] = Text
}

export {
  initText
}
