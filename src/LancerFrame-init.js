// Lancer Frame V0.0.1 By LancerComet at 12:06, 2016.06.02.
// # Carry Your World #

export {initFunc}

import {setStaticFunc} from "./static-func/_main"  
import {directiveMain} from "./directives/_main"   
import {domInit} from "./dom-init/_main"  

function initFunc ($lc) {
    
    // 设置静态方法.
    setStaticFunc($lc);
        
    // 指令逻辑初始化.
    directiveMain($lc);
    
    // 扫描文档结构.
    domInit($lc);
    
}