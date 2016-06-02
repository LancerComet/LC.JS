// Lancer Frame V0.0.1 By LancerComet at 12:09, 2016.06.02.
// # Carry Your World #
// ---
// 指令逻辑入口文件.

export {directiveMain}

import {directive} from "./directive"
import {lcText} from "./lc-text"
import {lcModel} from "./lc-model"    
import {lcHTML} from "./lc-html"

function directiveMain ($lc) {
    
    // 定义指令存储数组.
    // {name: options}
    $lc.directives = {};

    // 定义 directive 指令定义方法.
    $lc.directive = directive;
    
    // 初始化内置指令.
    lcModel($lc);
    lcText($lc);
    lcHTML($lc);
    
}