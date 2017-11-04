import { DirectiveConfig } from '../../core/config'
import { createDirective } from '../modules/directive'

function initIf (directiveStore: {[directiveName: string]: typeof Directive}) {
  const DIRECTIVE_NAME = `${DirectiveConfig.flags.internal}if`

  const If = createDirective({
    name: DIRECTIVE_NAME,
    isCustom: true,

    onInstall (directive: Directive) {
      console.log('lc-if oninstall')
    },

    onInstalled (directive: Directive, newValue: any, component: LC) {
      console.log('lc-if oninstalled')
    },

    onUpdated (directive: Directive, newValue: any, component: LC) {
    }
  })

  directiveStore[DIRECTIVE_NAME] = If
}

export {
  initIf
}
