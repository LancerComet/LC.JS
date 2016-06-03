// Lancer Frame V0.0.1 By LancerComet at 12:09, 2016.06.02.
// # Carry Your World #

export { staticFunc as setStaticFunc }

import {css} from "./css"
import {on} from "./on-off"
import {off} from "./on-off"
import {controller} from "../controller/controller"
import {directive} from "../directives/directive"

function staticFunc ($lc) {
    controller($lc);  // $lc.controller.
    directive($lc);  // $lc.directive.
    css($lc);  // $lc.css.
    on($lc); // $lc.on.
    off($lc);  // $lc.off.
}