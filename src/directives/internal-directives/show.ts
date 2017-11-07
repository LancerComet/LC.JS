import { DirectiveConfig } from '../../core/config'
import { createDirective } from '../modules/directive'

function initShow (directiveStore: {[directiveName: string]: typeof Directive}) {
  const DIRECTIVE_NAME = `${DirectiveConfig.flags.internal}show`

  directiveStore[DIRECTIVE_NAME] = createDirective({
    name: DIRECTIVE_NAME,
    isCustom: true,

    onUpdated (directive: Directive, newValue?: any, component?: LC) {
      console.log('lc-show updated', directive, newValue, component)
    }
  })
}

export {
  initShow
}
