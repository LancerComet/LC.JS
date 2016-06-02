// Lancer Frame V0.0.1 By LancerComet at 12:09, 2016.06.02.
// # Carry Your World #

export { staticFunc as setStaticFunc }

import {controller} from "./controller"
import {directive} from "./directive"

function staticFunc ($lc) {
    controller($lc);  // 初始化控制器函数.
}