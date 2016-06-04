// Lancer Frame V0.0.1 By LancerComet at 12:09, 2016.06.02.
// # Carry Your World #

export { staticFunc as setStaticFunc }


import {observe} from "./observe"
import {controller} from "../controller/controller"
import {directive} from "../directives/directive"
import {css} from "./css"
import {on} from "./on-off"
import {off} from "./on-off"

function staticFunc ($lc) {
    observe($lc);  // $lc.observe.
    controller($lc);  // $lc.controller.
    directive($lc);  // $lc.directive.
    css($lc);  // $lc.css.
    on($lc); // $lc.on.
    off($lc);  // $lc.off.
}