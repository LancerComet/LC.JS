// Lancer Frame V0.0.1 By LancerComet at 12:09, 2016.06.02.
// # Carry Your World #

export { staticFunc as setStaticFunc }


import {observe} from "./observe"
import {getDirectives} from "./get-directives"
import {css} from "./css"
import {on} from "./on-off"
import {off} from "./on-off"
import {log} from "./log"

function staticFunc ($lc) {
    observe($lc);  // $lc.observe.
    getDirectives($lc); // $lc.getDirectives.
    css($lc);  // $lc.css.
    on($lc); // $lc.on.
    off($lc);  // $lc.off.
    log($lc);  // $lc.log.
}