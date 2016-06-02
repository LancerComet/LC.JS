// Lancer Frame V0.0.1 By LancerComet at 12:09, 2016.06.02.
// # Carry Your World #
// ---
// 指令定义方法.
// 本方法用于定义指令.

import {_} from "../_/_"

export { directive }

function directive ($lc) {
    
    return function (name, options) {
        
        /*
         * @ name: String,
         * @ options: {
         *       $init: Function,  // 指令初始化时执行.
         *       $done: Function,  // 指令初始化完毕后执行.
         *       $update: Function,  // 指令节点进行更新时执行.
         *       $destory: Function  // 指令在销毁时执行.
         *   }   
         */
    
        if (_.typeof(name) !== "string") {
            throw new Error(`自定义指令时必须使用字符串作为指令名称.`);
        }
        
        $lc.directives["lc-" + name] = options;
    }
    
}