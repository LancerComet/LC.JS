// Lancer Frame V0.0.1 By LancerComet at 12:09, 2016.06.02.
// # Carry Your World #
// ---
// 指令逻辑入口文件.

export {directiveMain}

import {internalDirectives} from "./internal-directives"

function directiveMain ($lc) {
    
    // 初始化内置指令.
    internalDirectives($lc);
    
}