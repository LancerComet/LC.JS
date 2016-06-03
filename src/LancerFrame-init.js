// Lancer Frame V0.0.1 By LancerComet at 12:06, 2016.06.02.
// # Carry Your World #

export {initFunc}

import {directiveMain} from "./directives/_main"
import {serviceMain} from "./service/_main"
import {domInit} from "./dom-init/_main"  

function initFunc ($lc) {
    
    directiveMain($lc);  // 指令逻辑初始化.
    serviceMain($lc);  // 服务初始化.
    domInit($lc);  // 扫描文档结构.
    
}